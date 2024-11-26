import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { providers } from '$lib/server/auth/oauth/OAuthClient';
import db from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { verifyPassword } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email().max(128),
	password: z.string().max(128)
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

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

		console.log('existingUser', existingUser);
		const validPassword = await verifyPassword(existingUser?.password ?? '', password);
		console.log('validPassword', validPassword);
		if (!validPassword || !existingUser) {
			return message(form, { status: 'error', text: 'Incorrect username or password' });
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/profile');
	}
} satisfies Actions;
