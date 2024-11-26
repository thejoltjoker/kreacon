import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { availableOAuthProviders } from '$lib/server/auth/oauth/getOAuthClient';
import { db } from '$lib/server/db';
import users, { insertUserSchema } from '$lib/server/db/schema/user';
import { createLogger } from '$lib/server/logger';
import { hashPassword } from '$lib/server/utils';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

const logger = createLogger('register');

export const load = (async () => {
	const form = await superValidate(zod(insertUserSchema));
	const providers = availableOAuthProviders();
	return { providers, form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event.request, zod(insertUserSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { username, password, email } = form.data;

		const passwordHash = await hashPassword(password);
		const existingUsername = await db.query.users.findFirst({
			where: eq(users.username, username)
		});
		if (existingUsername) {
			setError(form, 'username', 'Username is already taken.');
			return fail(400, { form });
		}
		try {
			const [createdUser] = await db
				.insert(users)
				.values({ username, email, password: passwordHash })
				.returning();

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, createdUser.id);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			logger.error(JSON.stringify(e));
			return message(form, 'Something went wrong', { status: 500 });
		}
		// await sendEmailVerification(email.toString());
		return redirect(302, '/');
	},
	check: async ({ request }) => {
		const form = await superValidate(request, zod(insertUserSchema.pick({ username: true })));

		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUser = await db.query.users.findFirst({
			where: eq(users.username, form.data.username)
		});

		if (existingUser) {
			setError(form, 'username', 'Username is already taken.');
			return fail(400, { form });
		}

		return { form };
	}
};
