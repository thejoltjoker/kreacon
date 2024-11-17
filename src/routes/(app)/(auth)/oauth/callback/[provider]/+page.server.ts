import { getOAuthClient } from '$lib/server/auth/oauth/getOAuthClient';
import { isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth/OAuthClient';
import db from '$lib/server/db';
import { accounts, users } from '$lib/server/db/schema';
import ServerError from '$lib/server/ServerError';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { randomString } from '$lib/helpers/randomString';
import bcrypt from 'bcryptjs';
import { createSession } from '$lib/server/auth/createSession';
import { createTokens } from '$lib/server/auth/createTokens';
import { setCookies } from '$lib/server/auth/setCookies';

export const load = (async ({ params, url, cookies }) => {
	const provider = params.provider;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	console.log('OAuth callback', { provider, code });
	console.info('OAuth callback', { provider, code });

	if (!provider) {
		throw new ServerError(400, 'Missing provider');
	}

	if (!code) {
		throw new ServerError(400, 'Missing code');
	}

	if (!state) {
		throw new ServerError(400, 'Missing state');
	}

	if (cookies.get('oauth_state') !== state) {
		throw new ServerError(400, 'Invalid state');
	}

	if (!isOAuthProvider(provider)) {
		throw new ServerError(400, 'Invalid provider');
	}

	const client = getOAuthClient(provider as OAuthProvider);
	console.info('OAuth client', { client });
	const oauthToken = await client.getAccessToken(code);
	console.info('OAuth token', { oauthToken });

	// Get user info
	const userInfo = await client.getUser(oauthToken.access_token);
	console.info('User info', { userInfo });

	let user = await db.query.users.findFirst({
		where: eq(users.email, userInfo.email)
	});

	if (!user) {
		[user] = await db
			.insert(users)
			.values({
				username: randomString(),
				password: await bcrypt.hash(crypto.randomUUID(), 12),
				email: userInfo.email
			})
			.returning();
	}

	await db
		.insert(accounts)
		.values({ userId: user.id, provider: provider, providerAccountId: String(userInfo.id) })
		.onConflictDoNothing();

	const session = await createSession(user.id);
	console.debug(`Session created for user ${user.id}: ${session.sessionToken}`);

	const { accessToken, refreshToken } = createTokens(session.sessionToken, user.id);
	console.debug(`Tokens created for user ${user.id}`);

	setCookies(cookies, accessToken, refreshToken);
	console.debug(`Cookies set for user ${user.id}`);

	console.info(`User ${user.id} logged in successfully`);

	cookies.delete('oauth_state', { path: '/oauth/callback' });

	const { password: _, ...userWithoutPassword } = user;

	return { user: userWithoutPassword };
}) satisfies PageServerLoad;
