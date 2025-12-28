import { env } from '$env/dynamic/private';
import { createLogger } from '$lib/helpers/logger';
import { redirect } from '@sveltejs/kit';
import type { OAuthAccessTokenResponse } from '../../../types/OAuthAccessTokenResponse';
import { StatusCodes } from 'http-status-codes';

const logger = createLogger('oauth');

export interface OAuthProviderConfig {
	scopes: string[];
	urls: {
		auth: string;
		token: string;
		user: string;
		emails?: string;
	};
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export const providers = ['github', 'discord'] as const; // TODO Add Google
export type OAuthProvider = (typeof providers)[number];

export const isOAuthProvider = (value: string): value is OAuthProvider => {
	return providers.includes(value as OAuthProvider);
};

export const providerConfig: Record<OAuthProvider, OAuthProviderConfig> = {
	github: {
		scopes: ['read:user', 'user:email'],
		urls: {
			auth: 'https://github.com/login/oauth/authorize',
			token: 'https://github.com/login/oauth/access_token',
			user: 'https://api.github.com/user',
			emails: 'https://api.github.com/user/emails'
		},
		clientId: env.OAUTH_GITHUB_CLIENT_ID ?? '',
		clientSecret: env.OAUTH_GITHUB_CLIENT_SECRET ?? '',
		redirectUri: env.OAUTH_GITHUB_REDIRECT_URI ?? ''
	},
	discord: {
		scopes: ['identify', 'email'],
		urls: {
			auth: 'https://discord.com/oauth2/authorize',
			token: 'https://discord.com/api/oauth2/token',
			user: 'https://discord.com/api/v10/users/@me'
		},
		clientId: env.OAUTH_DISCORD_CLIENT_ID ?? '',
		clientSecret: env.OAUTH_DISCORD_CLIENT_SECRET ?? '',
		redirectUri: env.OAUTH_DISCORD_REDIRECT_URI ?? ''
	}
};

export class OAuthBase {
	constructor(
		public providerConfig: OAuthProviderConfig,
		public state: string = crypto.randomUUID()
	) {}

	async post<T>(url: string, headers: Record<string, string>, body?: Record<string, string>) {
		try {
			const request = new Request(url, {
				method: 'POST',
				headers: headers,
				body: body ? new URLSearchParams(body) : undefined
			});
			const response = await fetch(request);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data: T = await response.json();
			return data;
		} catch (error) {
			logger.error('Error fetching access token:', { error });
			throw error;
		}
	}

	async getAccessToken(code: string): Promise<OAuthAccessTokenResponse> {
		return Promise.resolve({ code } as unknown as OAuthAccessTokenResponse); // TODO Make this better
	}

	authUrl(params: Record<string, string> = {}): string {
		const urlParams = new URLSearchParams({
			client_id: this.providerConfig.clientId,
			redirect_uri: this.providerConfig.redirectUri,
			scope: this.providerConfig.scopes.join(' '),
			state: this.state,
			...params
		});

		const url = `${this.providerConfig.urls.auth}?${urlParams}`;
		logger.info('Generated auth URL', url);
		return url;
	}

	authorize(state?: string) {
		if (state) this.state = state;
		return redirect(StatusCodes.TEMPORARY_REDIRECT, this.authUrl());
	}

	async getUser(accessToken: string) {
		const response = await fetch(this.providerConfig.urls.user, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return response.json();
	}
}
