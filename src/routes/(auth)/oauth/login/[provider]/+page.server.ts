import { dev } from '$app/env';
import { getOAuthClient } from '#lib/server/auth/oauth/getOAuthClient';
import { isOAuthProvider, type OAuthProvider } from '#lib/server/auth/oauth/OAuthClient';
import { createBackendLogger } from '#lib/server/logger';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { PageServerLoad } from './$types';

const logger = createBackendLogger('auth/login');
const OAUTH_STATE_COOKIE = 'oauth_state';

export const load = (async ({ params, cookies }) => {
	const { provider } = params;

	if (!provider) {
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	if (!isOAuthProvider(provider)) {
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	const client = getOAuthClient(provider as OAuthProvider);

	const existingState = cookies.get(OAUTH_STATE_COOKIE);
	if (existingState) {
		client.state = existingState;
	} else {
		cookies.set(OAUTH_STATE_COOKIE, client.state, {
			path: '/oauth/callback',
			httpOnly: true,
			secure: !dev,
			maxAge: 60 * 10 // 10 minutes
		});
	}

	logger.info('OAuth client', { provider, state: client.state, reusedState: !!existingState });
	redirect(StatusCodes.TEMPORARY_REDIRECT, client.authUrl(), {
		external: [new URL(client.providerConfig.urls.auth).origin]
	});
}) satisfies PageServerLoad;
