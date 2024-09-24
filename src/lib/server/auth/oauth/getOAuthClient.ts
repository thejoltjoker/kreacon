import { createLogger } from '../../logger';
import { DiscordOAuth } from './DiscordOAuthClient';
import { GithubOAuth } from './GitHubOAuthClient';
import type { OAuthProvider } from './OAuthClient';

const logger = createLogger('oauth');

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
