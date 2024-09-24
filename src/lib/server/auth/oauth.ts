import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_REDIRECT_URI
} from '$env/static/private';
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
		scopes: ['identify', 'email'],
		urls: {
			auth: 'https://discord.com/oauth2/authorize',
			token: 'https://discord.com/api/oauth2/token',
			user: 'https://discord.com/api/v10/users/@me'
		},
		clientId: DISCORD_CLIENT_ID ?? '',
		clientSecret: DISCORD_CLIENT_SECRET ?? '',
		redirectUri: DISCORD_REDIRECT_URI ?? ''
	}
};

export class OAuthBase {
	constructor(
		public providerConfig: OAuthProviderConfig,
		public state: string = crypto.randomUUID()
	) {}

	getAuthUrl() {
		const params = new URLSearchParams({
			client_id: this.providerConfig.clientId,
			redirect_uri: this.providerConfig.redirectUri,
			scope: this.providerConfig.scopes.join(' ')
		});
		const url = `${this.providerConfig.urls.auth}?${params.toString()}`;
		logger.info('Generated auth URL', { url });
		return url;
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
				client_id: this.providerConfig.clientId,
				client_secret: this.providerConfig.clientSecret,
				code,
				redirect_uri: this.providerConfig.redirectUri
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

	getAuthUrl() {
		const params = new URLSearchParams({
			client_id: this.providerConfig.clientId,
			redirect_uri: this.providerConfig.redirectUri,
			scope: this.providerConfig.scopes.join(' '),
			response_type: 'code'
		});
		const url = `${this.providerConfig.urls.auth}?${params.toString()}`;
		logger.info('Generated auth URL', { url });
		return url;
	}

	async getAccessToken(code: string): Promise<DiscordAccessTokenResponse> {
		try {
			const params = new URLSearchParams({
				client_id: this.providerConfig.clientId,
				client_secret: this.providerConfig.clientSecret,
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: this.providerConfig.redirectUri
			});

			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			};

			const url = `${this.providerConfig.urls.token}`;

			logger.info('Fetching access token from Discord', { url, params, headers });

			const response = await fetch(url, {
				method: 'POST',
				body: params,
				headers: headers
			});

			if (!response.ok) {
				logger.error('Network response was not ok', { response });
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			logger.info('Discord access token response', { data });
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
