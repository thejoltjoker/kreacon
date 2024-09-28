import { createSession } from '$lib/server/auth/createSession';
import { createTokens } from '$lib/server/auth/createTokens';
import { setCookies } from '$lib/server/auth/setCookies';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { redirect, type Actions, fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';
import { availableOAuthProviders } from '$lib/server/auth/oauth/getOAuthClient';
import { createLogger } from '$lib/server/logger';

const logger = createLogger('login');

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/profile');
	}

	const providers = availableOAuthProviders();
	logger.info('Available OAuth providers', { providers });
	return { providers };
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		logger.info('Login attempt initiated');
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			logger.warn('Login attempt failed: Missing email or password');
			return fail(400, { email, password, emailMissing: true });
		}

		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (!user) {
			logger.warn(`Login attempt failed: User not found for email ${email}`);
			return fail(401, { message: 'Invalid email or password' });
		}

		if (!user.password) {
			logger.error(`User ${user.id} has no password set`);
			return error(500, { message: 'Something went wrong' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			logger.warn(`Login attempt failed: Incorrect password for user ${user.id}`);
			return fail(401, { message: 'Invalid email or password' });
		}

		logger.info(`User ${user.id} authenticated successfully`);

		const session = await createSession(user.id);
		logger.debug(`Session created for user ${user.id}: ${session.sessionToken}`);

		const { accessToken, refreshToken } = createTokens(session.sessionToken, user.id);
		logger.debug(`Tokens created for user ${user.id}`);

		setCookies(cookies, accessToken, refreshToken);
		logger.debug(`Cookies set for user ${user.id}`);

		logger.info(`User ${user.id} logged in successfully`);
		throw redirect(302, '/profile');
	}
};
