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
		const user = await super.getUser(accessToken);

		if (!user.email && this.providerConfig.urls.emails) {
			const emailsResponse = await fetch(this.providerConfig.urls.emails, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'application/json'
				}
			});

			if (emailsResponse.ok) {
				const emails: Array<{ email: string; primary: boolean; verified: boolean }> =
					await emailsResponse.json();
				const primaryEmail =
					emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified);
				if (primaryEmail) {
					user.email = primaryEmail.email;
				}
			}
		}

		return user;
	}
}
