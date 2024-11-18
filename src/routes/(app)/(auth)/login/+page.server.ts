import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import db from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { providers } from '$lib/server/auth/oauth/OAuthClient';
const schema = z.object({
	email: z.string().email(),
	password: z.string()
});
export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(302, '/profile');
	}

	const form = await superValidate(zod(schema));

	return { form, providers };
}) satisfies PageServerLoad;

export const actions = {
	login: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

		if (!existingUser) {
			return message(form, { status: 'error', text: 'Incorrect username or password' });
		}

		const validPassword = await bcrypt.compare(password, existingUser.password);
		if (!validPassword) {
			return message(form, { status: 'error', text: 'Incorrect username or password' });
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/profile');
	}
} satisfies Actions;
