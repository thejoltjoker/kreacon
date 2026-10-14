import {
	OAUTH_DISCORD_CLIENT_ID,
	OAUTH_DISCORD_CLIENT_SECRET,
	OAUTH_GITHUB_CLIENT_ID,
	OAUTH_GITHUB_CLIENT_SECRET
} from '$app/env/private';
import { DiscordOAuth } from './DiscordOAuthClient';
import { GithubOAuth } from './GitHubOAuthClient';
import type { OAuthProvider } from './OAuthClient';
import { createBackendLogger } from '#lib/server/logger';

const logger = createBackendLogger('oauth');

export const availableOAuthProviders = (): OAuthProvider[] => {
	const providers: OAuthProvider[] = [];

	if (OAUTH_GITHUB_CLIENT_ID && OAUTH_GITHUB_CLIENT_SECRET) providers.push('github');
	if (OAUTH_DISCORD_CLIENT_ID && OAUTH_DISCORD_CLIENT_SECRET) providers.push('discord');
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
