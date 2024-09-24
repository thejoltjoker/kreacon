import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { createLogger } from '../logger';
import type { DiscordAccessTokenResponse, DiscordUserResponse } from './types/discord';
import type { GitHubAccessTokenResponse, GitHubUserResponse } from './types/github';

const logger = createLogger('oauth');

export interface OAuthProviderConfig {
	scopes: string[];
	urls: {
		auth: string;
		token: string;
		user: string;
	};
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export const providers = ['github', 'discord'] as const; // TODO: Add Discord and Google
export type OAuthProvider = (typeof providers)[number];

export const isOAuthProvider = (value: string): value is OAuthProvider => {
	return providers.includes(value as OAuthProvider);
};

const providerConfig: Record<OAuthProvider, OAuthProviderConfig> = {
	github: {
		scopes: ['read:user'],
		urls: {
			auth: 'https://github.com/login/oauth/authorize',
			token: 'https://github.com/login/oauth/access_token',
			user: 'https://api.github.com/user'
		},
		clientId: GITHUB_CLIENT_ID ?? '',
		clientSecret: GITHUB_CLIENT_SECRET ?? '',
		redirectUri: GITHUB_REDIRECT_URI ?? ''
	},
	discord: {
		scopes: ['email'],
		urls: {
			auth: 'https://discord.com/oauth2/authorize',
			token: 'https://discord.com/api/oauth2/token',
			user: 'https://api.github.com/user'
		},
		clientId: DISCORD_CLIENT_ID ?? '',
		clientSecret: DISCORD_CLIENT_SECRET ?? '',
		redirectUri: DISCORD_REDIRECT_URI ?? ''
	}
};

export class OAuthBase {
	constructor(
		public providerConfig: OAuthProviderConfig,
		public clientId: string = '',
		public clientSecret: string = '',
		public redirectUri: string = '',
		public state: string = crypto.randomUUID()
	) {}

	getAuthUrl() {
		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			scope: this.providerConfig.scopes.join(' '),
			state: this.state
		});
		return `${this.providerConfig.urls.auth}?${params.toString()}`;
	}

	authorize() {
		return redirect(302, this.getAuthUrl());
	}

	// async getAccessToken(code: string) {}

	async getUser(accessToken: string) {
		const response = await fetch(this.providerConfig.urls.user, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return response.json();
	}
}

export class GithubOAuth extends OAuthBase {
	constructor() {
		super(providerConfig['github']);
	}

	async getAccessToken(code: string): Promise<GitHubAccessTokenResponse> {
		try {
			const params = new URLSearchParams({
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code,
				redirect_uri: this.redirectUri
			});

			const headers = { Accept: 'application/json' };

			const url = `${this.providerConfig.urls.token}?${params.toString()}`;

			const response = await fetch(url, {
				method: 'POST',
				headers: headers
			});

			if (!response.ok) {
				logger.error('Network response was not ok', { response });
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			logger.error('Error fetching access token:', { error });
			throw error;
		}
	}

	async getUser(accessToken: string): Promise<GitHubUserResponse> {
		return super.getUser(accessToken);
	}
}

export class DiscordOAuth extends OAuthBase {
	constructor() {
		super(providerConfig['discord']);
	}

	async getAccessToken(code: string): Promise<DiscordAccessTokenResponse> {
		try {
			const body = new URLSearchParams({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: this.redirectUri
			});

			const authHeader = btoa(`${this.clientId}:${this.clientSecret}`);

			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${authHeader}`
			};

			const url = `${this.providerConfig.urls.token}`;

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: body
			});

			if (!response.ok) {
				logger.error('Network response was not ok', { response });
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			logger.error('Error fetching access token:', { error });
			throw error;
		}
	}

	async getUser(accessToken: string): Promise<DiscordUserResponse> {
		return super.getUser(accessToken);
	}
}

export const getOAuthClient = (provider: OAuthProvider) => {
	if (provider === 'github') {
		return new GithubOAuth();
	} else if (provider === 'discord') {
		return new DiscordOAuth();
	} else {
		logger.error('Invalid OAuth provider', { provider });
		throw new Error('Invalid OAuth provider');
	}
};
