export interface DiscordAccessTokenResponse {
	token_type: string;
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export interface DiscordUserResponse {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: null;
	accent_color: null;
	global_name: string;
	avatar_decoration_data: null;
	banner_color: null;
	clan: null;
	mfa_enabled: boolean;
	locale: string;
	premium_type: number;
	email: string;
	verified: boolean;
}
