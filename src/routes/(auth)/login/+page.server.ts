import { loginSchema } from '$lib/schemas/loginSchema';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { providers } from '$lib/server/auth/oauth/OAuthClient';
import db from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { verifyPassword } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/profile');
	}

	const form = await superValidate(zod(loginSchema));

	return { form, providers };
}) satisfies PageServerLoad;

export const actions = {
	login: async (event) => {
		const form = await superValidate(event.request, zod(loginSchema));

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

		const { email, password } = form.data;

		const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

		const validPassword = await verifyPassword(existingUser?.password ?? '', password);

		if (!validPassword || !existingUser) {
			return message(form, { status: 'error', text: 'Incorrect email or password' });
		}

		if (existingUser.status === 'banned') {
			return message(form, { status: 'error', text: 'Something went wrong' });
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/profile');
	}
} satisfies Actions;
