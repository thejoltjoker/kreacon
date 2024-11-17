export interface GitHubUserResponse {
	avatar_url: string;
	bio: string;
	blog: string;
	collaborators: number;
	company: string;
	created_at: Date;
	disk_usage: number;
	email: string;
	events_url: string;
	followers_url: string;
	followers: number;
	following_url: string;
	following: number;
	gists_url: string;
	gravatar_id: string;
	hireable: boolean;
	html_url: string;
	id: number;
	location: string;
	login: string;
	name: string;
	node_id: string;
	notification_email: string;
	organizations_url: string;
	owned_private_repos: number;
	plan: GitHubPlan;
	private_gists: number;
	public_gists: number;
	public_repos: number;
	received_events_url: string;
	repos_url: string;
	site_admin: boolean;
	starred_url: string;
	subscriptions_url: string;
	total_private_repos: number;
	twitter_username: null;
	two_factor_authentication: boolean;
	type: string;
	updated_at: Date;
	url: string;
}

export interface GitHubPlan {
	name: string;
	space: number;
	collaborators: number;
	private_repos: number;
}
