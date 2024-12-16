import { DiscordOAuth } from './DiscordOAuthClient';
import { GithubOAuth } from './GitHubOAuthClient';
import type { OAuthProvider } from './OAuthClient';
import { env } from '$env/dynamic/private';
import { createLogger } from '$lib/helpers/logger';

const logger = createLogger('oauth');

export const availableOAuthProviders = (): OAuthProvider[] => {
	const providers: OAuthProvider[] = [];

	if (env.OAUTH_GITHUB_CLIENT_ID && env.OAUTH_GITHUB_CLIENT_SECRET) providers.push('github');
	if (env.OAUTH_DISCORD_CLIENT_ID && env.OAUTH_DISCORD_CLIENT_SECRET) providers.push('discord');
	return providers;
};

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
