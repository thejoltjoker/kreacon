import type { DiscordUserResponse } from '../types/discord';
import type { DiscordAccessTokenRequestBody } from '../types/OAuthAccessTokenRequest';
import type { DiscordAccessTokenResponse } from '../types/OAuthAccessTokenResponse';
import { OAuthBase, providerConfig } from './OAuthClient';

export class DiscordOAuth extends OAuthBase {
	constructor() {
		super(providerConfig['discord']);
	}

	authUrl(): string {
		return super.authUrl({ response_type: 'code' });
	}

	async getAccessToken(code: string): Promise<DiscordAccessTokenResponse> {
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		};

		const body: DiscordAccessTokenRequestBody = {
			client_id: this.providerConfig.clientId,
			client_secret: this.providerConfig.clientSecret,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: this.providerConfig.redirectUri
		};

		return this.post<DiscordAccessTokenResponse>(this.providerConfig.urls.token, headers, body);
	}

	async getUser(accessToken: string): Promise<DiscordUserResponse> {
		return super.getUser(accessToken);
	}
}
