export interface AccessTokenRequestBase extends Record<string, string> {
	client_id: string;
	client_secret: string;
	code: string;
	redirect_uri: string;
}

export type GitHubAccessTokenRequestParams = {} & AccessTokenRequestBase;

export interface DiscordAccessTokenRequestBody extends AccessTokenRequestBase {
	grant_type: 'authorization_code';
}

export type OAuthAccessTokenRequest =
	| GitHubAccessTokenRequestParams
	| DiscordAccessTokenRequestBody;
