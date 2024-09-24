import { createSession } from '$lib/server/auth/createSession';
import { createTokens } from '$lib/server/auth/createTokens';
import { setCookies } from '$lib/server/auth/setCookies';
import { db } from '$lib/server/db';
import { accounts, users } from '$lib/server/db/schema';
import { createLogger } from '$lib/server/logger';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { getOAuthClient } from '$lib/server/auth/oauth/getOAuthClient';
import { isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth/OAuthClient';
const logger = createLogger('auth/callback');

export const GET: RequestHandler = async ({ url, params, cookies }) => {
	const provider = params.provider;
	const code = url.searchParams.get('code');
	// const state = url.searchParams.get('state'); // TODO: Implement state verification
	console.log('OAuth callback', { provider, code });
	logger.info('OAuth callback', { provider, code });

	if (!provider || !code) {
		return error(400, 'Missing provider or code');
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
		const inserted = await db
			.insert(users)
			.values({
				email: userInfo.email
			})
			.returning();
		user = inserted[0];
	}

	await db
		.insert(accounts)
		.values({ userId: user.id, provider: provider, providerAccountId: String(userInfo.id) })
		.onConflictDoNothing();

	const session = await createSession(user.id);
	logger.debug(`Session created for user ${user.id}: ${session.sessionToken}`);

	const { accessToken, refreshToken } = createTokens(session.sessionToken, user.id);
	logger.debug(`Tokens created for user ${user.id}`);

	setCookies(cookies, accessToken, refreshToken);
	logger.debug(`Cookies set for user ${user.id}`);

	logger.info(`User ${user.id} logged in successfully`);
	throw redirect(302, '/profile');
};
