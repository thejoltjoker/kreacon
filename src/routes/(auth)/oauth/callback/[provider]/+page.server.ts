import { createBackendLogger } from '$lib/server/logger';
import { randomString } from '$lib/helpers/randomString';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { getOAuthClient } from '$lib/server/auth/oauth/getOAuthClient';
import { isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth/OAuthClient';
import { db } from '$lib/server/db';
import { accounts, users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/utils';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { PageServerLoad } from './$types';

const logger = createBackendLogger('oauth/callback');
export const load = (async (event) => {
	const { url, params, cookies } = event;
	const provider = params.provider;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	try {
		logger.info('OAuth callback', {
			provider,
			code,
			state,
			hasStoredState: !!cookies.get('oauth_state')
		});

		if (!provider) {
			return error(400, 'Missing provider');
		}

		if (!code) {
			return error(400, 'Missing code');
		}

		if (!state) {
			return error(400, 'Missing state');
		}

		const storedState = cookies.get('oauth_state');
		if (storedState !== state) {
			logger.error('State mismatch', { storedState, receivedState: state });
			return error(400, 'Invalid state');
		}

		if (!isOAuthProvider(provider)) {
			return error(400, 'Invalid provider');
		}

		const client = getOAuthClient(provider as OAuthProvider);
		logger.info('Getting OAuth access token', { provider });

		const oauthToken = await client.getAccessToken(code);
		logger.info('OAuth token received', { hasAccessToken: !!oauthToken.access_token });

		const userInfo = await client.getUser(oauthToken.access_token);
		logger.info('User info received', { email: userInfo.email, userId: userInfo.id });

		if (!userInfo.email) {
			logger.error('OAuth provider did not return email address', {
				provider,
				userId: userInfo.id
			});
			throw error(
				StatusCodes.BAD_REQUEST,
				'Email address is required. Please ensure your OAuth account has a verified email.'
			);
		}

		let user = await db.query.users.findFirst({
			where: eq(users.email, userInfo.email)
		});

		if (!user) {
			[user] = await db
				.insert(users)
				.values({
					username: randomString(),
					password: await hashPassword(crypto.randomUUID()),
					email: userInfo.email,
					emailVerifiedAt: new Date()
				})
				.returning();
			logger.info('Created new user via OAuth', { userId: user.id, provider });
		} else if (!user.emailVerifiedAt) {
			[user] = await db
				.update(users)
				.set({ emailVerifiedAt: new Date() })
				.where(eq(users.id, user.id))
				.returning();
			logger.info(`Verified email for existing user ${user.id} via OAuth`);
		}

		await db
			.insert(accounts)
			.values({ userId: user.id, provider: provider, providerAccountId: String(userInfo.id) })
			.onConflictDoNothing();

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		cookies.delete('oauth_state', { path: '/oauth/callback' });

		logger.info('OAuth login successful', { userId: user.id, provider });
		throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/profile');
	} catch (err) {
		logger.error('OAuth callback error', {
			error: err,
			provider,
			errorMessage: err instanceof Error ? err.message : String(err),
			errorStack: err instanceof Error ? err.stack : undefined
		});
		throw err;
	}
}) satisfies PageServerLoad;
