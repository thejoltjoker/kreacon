import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createLogger } from '$lib/server/logger';
import { getOAuthClient } from '$lib/server/auth/oauth/getOAuthClient';
import { isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth/OAuthClient';
import { dev } from '$app/environment';
const logger = createLogger('auth/login');
export const GET: RequestHandler = async ({ params, cookies }) => {
	const { provider } = params;

	if (!provider) {
		return redirect(302, '/login');
	}

	if (!isOAuthProvider(provider)) {
		return redirect(302, '/login');
	}

	const client = getOAuthClient(provider as OAuthProvider);
	logger.info('OAuth client', { client });

	cookies.set('oauth_state', client.state, {
		path: '/oauth/callback',
		httpOnly: true,
		secure: dev ?? true,
		maxAge: 60 * 10 // 10 minutes
	});

	return client.authorize();
};
