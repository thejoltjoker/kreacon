import { createLogger } from '$lib/server/logger';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getOAuthClient, isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth';
import { StatusCodes } from 'http-status-codes';
import { db } from '$lib/server/db';
import { accounts, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '$lib/server/auth/createSession';
import { setCookies } from '$lib/server/auth/setCookies';
import { createTokens } from '$lib/server/auth/createTokens';
const logger = createLogger('auth/callback');

export const GET: RequestHandler = async ({ url, params, cookies }) => {
	const provider = params.provider;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!provider || !code || !state) {
		return error(StatusCodes.BAD_REQUEST, 'Missing provider, code, or state');
	}

	if (!isOAuthProvider(provider)) {
		return error(StatusCodes.BAD_REQUEST, 'Invalid provider');
	}

	const client = getOAuthClient(provider as OAuthProvider);
	logger.info('OAuth client', { client });
	const oauthToken = await client.getAccessToken(code);

	// Get user info
	const userInfo = await client.getUser(oauthToken.access_token);

	let user = await db.query.users.findFirst({
		where: eq(users.email, userInfo.email)
	});

	if (!user) {
		user = await db.insert(users).values({
			email: userInfo.email
		});
	}

	await db
		.insert(accounts)
		.values({ userId: user.id, provider: provider, providerAccountId: userInfo.id })
		.onConflictDoNothing();

	const session = await createSession(user.id);
	logger.debug(`Session created for user ${user.id}: ${session.sessionToken}`);

	const { accessToken, refreshToken } = await createTokens(session.sessionToken, user.id);
	logger.debug(`Tokens created for user ${user.id}`);

	setCookies(cookies, accessToken, refreshToken);
	logger.debug(`Cookies set for user ${user.id}`);

	logger.info(`User ${user.id} logged in successfully`);
	throw redirect(StatusCodes.MOVED_TEMPORARILY, '/profile');
};
