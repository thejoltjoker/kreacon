import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { createLogger } from '../logger';
import { StatusCodes } from 'http-status-codes';
import type { GitHubAccessTokenResponse, GitHubUserResponse } from './types/github';

const logger = createLogger('oauth');

export interface OAuthProviderConfig {
	scopes: string[];
	urls: {
		auth: string;
		token: string;
		user: string;
	};
}

export const providers = ['github'] as const; // TODO: Add Discord and Google
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
		}
	}
};

export class OAuthBase {
	constructor(
		public clientId: string = '',
		public clientSecret: string = '',
		public redirectUri: string = '',
		public provider: OAuthProvider = 'github',
		public state: string = crypto.randomUUID()
	) {}

	getAuthUrl() {
		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			scope: providerConfig[this.provider].scopes.join(' '),
			state: this.state
		});
		return `${providerConfig[this.provider].urls.auth}?${params.toString()}`;
	}

	authorize() {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, this.getAuthUrl());
	}

	async getAccessToken(code: string) {
		try {
			const params = new URLSearchParams({
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code,
				redirect_uri: this.redirectUri
			});

			const url = `${providerConfig[this.provider].urls.token}?${params.toString()}`;

			const response = await fetch(url, {
				method: 'POST',
				headers: { Accept: 'application/json' }
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

	async getUser(accessToken: string) {
		const response = await fetch(providerConfig[this.provider].urls.user, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return response.json();
	}
}

export class GithubOAuth extends OAuthBase {
	constructor(
		clientId = GITHUB_CLIENT_ID ?? '',
		clientSecret = GITHUB_CLIENT_SECRET ?? '',
		redirectUri = GITHUB_REDIRECT_URI ?? ''
	) {
		super(clientId, clientSecret, redirectUri, 'github');
	}

	async getAccessToken(code: string): Promise<GitHubAccessTokenResponse> {
		return super.getAccessToken(code);
	}

	async getUser(accessToken: string): Promise<GitHubUserResponse> {
		return super.getUser(accessToken);
	}
}

export const getOAuthClient = (provider: OAuthProvider) => {
	if (provider === 'github') {
		return new GithubOAuth();
	} else {
		logger.error('Invalid OAuth provider', { provider });
		throw new Error('Invalid OAuth provider');
	}
};
