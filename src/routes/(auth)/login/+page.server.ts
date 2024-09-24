import { createSession } from '$lib/auth/createSession';
import { createTokens } from '$lib/auth/createTokens';
import { setCookies } from '$lib/auth/setCookies';
import { createLogger } from '$lib/logger';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
const logger = createLogger('login');

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/profile');
	}
	return {};
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

		const { accessToken, refreshToken } = await createTokens(session.sessionToken, user.id);
		logger.debug(`Tokens created for user ${user.id}`);

		setCookies(cookies, accessToken, refreshToken);
		logger.debug(`Cookies set for user ${user.id}`);

		logger.info(`User ${user.id} logged in successfully`);
		throw redirect(302, '/profile');
	}
};
