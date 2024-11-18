import { userRegistrationSchema } from '$lib/schemas/userRegistrationSchema';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { availableOAuthProviders } from '$lib/server/auth/oauth/getOAuthClient';
import { db } from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { createLogger } from '$lib/server/logger';

const logger = createLogger('register');

export const load = (async () => {
	const form = await superValidate(zod(userRegistrationSchema));
	const providers = availableOAuthProviders();
	return { providers, form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event.request, zod(userRegistrationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const passwordHash = await bcrypt.hash(form.data.password, 12);

		try {
			const [createdUser] = await db
				.insert(users)
				.values({ username: form.data.username, email: form.data.email, password: passwordHash })
				.returning();

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, createdUser.id);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			logger.error(JSON.stringify(e));
			return fail(500, { message: 'An error has occurred' });
		}
		// await sendEmailVerification(email.toString());
		return redirect(302, '/');
	}
};
