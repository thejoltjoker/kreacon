export interface OAuthAccessTokenResponseBase {
	token_type: string;
	access_token: string;
	scope: string;
}

export interface DiscordAccessTokenResponse extends OAuthAccessTokenResponseBase {
	expires_in: number;
	refresh_token: string;
}

export type GitHubAccessTokenResponse = {} & OAuthAccessTokenResponseBase;

export type OAuthAccessTokenResponse = DiscordAccessTokenResponse | GitHubAccessTokenResponse;
