import { randomString } from '$lib/helpers/randomString';
import { getOAuthClient } from '$lib/server/auth/oauth/getOAuthClient';
import { isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth/OAuthClient';
import { db } from '$lib/server/db';
import { accounts, users } from '$lib/server/db/schema';
import { createLogger } from '$lib/server/logger';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { hashPassword } from '$lib/server/utils';
import { StatusCodes } from 'http-status-codes';

const logger = createLogger('auth/callback');

export const GET: RequestHandler = async (event) => {
	const { url, params, cookies } = event;
	const provider = params.provider;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	logger.info('OAuth callback', { provider, code });

	if (!provider) {
		return error(400, 'Missing provider');
	}

	if (!code) {
		return error(400, 'Missing code');
	}

	if (!state) {
		return error(400, 'Missing state');
	}

	if (cookies.get('oauth_state') !== state) {
		return error(400, 'Invalid state');
	}

	if (!isOAuthProvider(provider)) {
		return error(400, 'Invalid provider');
	}

	const client = getOAuthClient(provider as OAuthProvider);
	logger.info('OAuth client', { client });
	const oauthToken = await client.getAccessToken(code);
	logger.info('OAuth token', { oauthToken });

	// Get user info
	const userInfo = await client.getUser(oauthToken.access_token);
	logger.info('User info', { userInfo });

	let user = await db.query.users.findFirst({
		where: eq(users.email, userInfo.email)
	});

	if (!user) {
		[user] = await db
			.insert(users)
			.values({
				username: randomString(),
				password: await hashPassword(crypto.randomUUID()),
				email: userInfo.email
			})
			.returning();
	}

	await db
		.insert(accounts)
		.values({ userId: user.id, provider: provider, providerAccountId: String(userInfo.id) })
		.onConflictDoNothing();

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	cookies.delete('oauth_state', { path: '/oauth/callback' });

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/profile');
};
