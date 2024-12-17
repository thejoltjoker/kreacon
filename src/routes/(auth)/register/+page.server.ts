import { availableOAuthProviders } from '$lib/server/auth/oauth/getOAuthClient';
import { db } from '$lib/server/db';
import users from '$lib/server/db/schema/user';

import { hashPassword } from '$lib/server/utils';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { registerUserSchema } from '$lib/schemas/user';
import { createLogger } from '$lib/helpers/logger';

const logger = createLogger('register');

export const load = (async () => {
	const form = await superValidate(zod(registerUserSchema));
	const providers = availableOAuthProviders();
	return { providers, form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event.request, zod(registerUserSchema));
		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, { form });
		}
		const { username, password, email } = form.data;

		const passwordHash = await hashPassword(password);
		const existingUser = await db.query.users.findFirst({
			where: or(eq(users.username, username), eq(users.email, email))
		});

		if (existingUser != null) {
			if (existingUser.status === 'banned') {
				logger.error('User is banned.', { username });
				return message(form, { text: 'Something went wrong', status: 'error' });
			}

			if (existingUser.username === username) {
				logger.error('Username is already taken.', { username });
				setError(form, 'username', 'Username is already taken.');
				return fail(StatusCodes.BAD_REQUEST, { form });
			}

			logger.error('Email is already taken.', { email });
			setError(form, 'email', 'Email is already taken.');
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

		try {
			await db.insert(users).values({ username, email, password: passwordHash }).returning();

			// const sessionToken = generateSessionToken();
			// const session = await createSession(sessionToken, createdUser.id);
			// setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			logger.error('Failed to register user', e);
			return message(form, { text: 'Something went wrong', status: 'error' });
		}
		// await sendEmailVerification(email.toString());
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	},
	check: async ({ request }) => {
		const form = await superValidate(request, zod(registerUserSchema.pick({ username: true })));

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

		const existingUser = await db.query.users.findFirst({
			where: eq(users.username, form.data.username)
		});

		if (existingUser) {
			setError(form, 'username', 'Username is already taken.');
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

		return { form };
	}
};
