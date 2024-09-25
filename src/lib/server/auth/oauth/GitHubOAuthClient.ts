import type { GitHubUserResponse } from '../../../types/GitHubUserResponse';
import type { GitHubAccessTokenRequestParams } from '../../../types/OAuthAccessTokenRequest';
import type { GitHubAccessTokenResponse } from '../../../types/OAuthAccessTokenResponse';
import { OAuthBase, providerConfig } from './OAuthClient';

export class GithubOAuth extends OAuthBase {
	constructor() {
		super(providerConfig['github']);
	}

	async getAccessToken(code: string): Promise<GitHubAccessTokenResponse> {
		const headers = {
			Accept: 'application/json'
		};

		const params: GitHubAccessTokenRequestParams = {
			client_id: this.providerConfig.clientId,
			client_secret: this.providerConfig.clientSecret,
			code,
			redirect_uri: this.providerConfig.redirectUri
		};

		const url = `${this.providerConfig.urls.token}?${new URLSearchParams(params).toString()}`;
		return this.post<GitHubAccessTokenResponse>(url, headers);
	}

	async getUser(accessToken: string): Promise<GitHubUserResponse> {
		return super.getUser(accessToken);
	}
}
