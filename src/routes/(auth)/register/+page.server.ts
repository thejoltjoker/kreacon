import { insertUserSchema, users } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { fromError } from 'zod-validation-error';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	store: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// TODO Validate email
		if (!email) {
			return fail(StatusCodes.BAD_REQUEST, { email, emailMissing: true });
		}

		// TODO Validate password
		if (!password) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password is required' });
		}

		try {
			insertUserSchema.partial({ password: true }).parse({ password });
		} catch (err) {
			const validationError = fromError(err);
			return fail(StatusCodes.BAD_REQUEST, { password: validationError.toString() });
		}

		const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

		if (existingUser) {
			return fail(StatusCodes.BAD_REQUEST, { email: 'Email already in use' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await db
			.insert(users)
			.values({ email, password: hashedPassword })
			.returning({ insertedId: users.id });

		console.info('[/register:store]', 'Created new user', result);

		if (result.length === 0) {
			return error(StatusCodes.INTERNAL_SERVER_ERROR, {
				message: 'Failed to create user'
			});
		}
		// TODO Send email verification
		// TODO Redirect to login

		return { success: true };
	}
};
