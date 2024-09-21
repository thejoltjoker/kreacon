import { createSession } from '$lib/auth/createSession';
import { createTokens } from '$lib/auth/createTokens';
import { setCookies } from '$lib/auth/setCookies';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { Actions, PageServerLoad } from './$types';
export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		console.log('[/login:login]', request);
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		console.log('[/login:login]', { email, password });

		if (!email || !password) {
			return fail(StatusCodes.BAD_REQUEST, { email, password, emailMissing: true });
		}

		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		console.log('[/login:login]', 'user', user);

		if (!user) {
			return fail(StatusCodes.UNAUTHORIZED, { message: 'Invalid email or password' });
		}

		if (!user.password) {
			return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Something went wrong' });
		}
		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			return fail(StatusCodes.UNAUTHORIZED, { message: 'Invalid email or password' });
		}

		const session = await createSession(user.id);
		const { accessToken, refreshToken } = await createTokens(session.sessionToken, user.id);
		setCookies(cookies, accessToken, refreshToken);

		return { success: true };
	}
};
