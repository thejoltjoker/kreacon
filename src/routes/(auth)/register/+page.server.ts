import { db } from '$lib/server/db';
import { insertUserSchema, users } from '$lib/server/db/schema';
import {
	hasNumber,
	hasSpecialCharacter,
	isCommonPassword,
	isLongEnough
} from '$lib/validation/password/passwordValidation';
import { error, fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { fromError } from 'zod-validation-error';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	store: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		// Validate email
		if (!email) {
			return fail(StatusCodes.BAD_REQUEST, { email, emailMissing: true });
		}

		try {
			insertUserSchema.partial({ email: true }).parse({ email });
		} catch (err) {
			const validationError = fromError(err);
			return fail(StatusCodes.BAD_REQUEST, { email: validationError.toString() });
		}

		// Check for existing user
		const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

		if (existingUser) {
			return fail(StatusCodes.BAD_REQUEST, { email: 'Email already in use' }); // TODO Make more obscure for security purposes
		}

		// Validate password
		if (!password) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password is required' });
		}

		if (!isLongEnough(password)) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password is too short' });
		}

		if (!hasSpecialCharacter(password)) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password needs special character' });
		}

		if (password === email) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password is too similar to email' });
		}

		if (!hasNumber(password)) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password needs number' });
		}

		if (!isCommonPassword(password)) {
			return fail(StatusCodes.BAD_REQUEST, { password: 'Password is too common' });
		}

		try {
			insertUserSchema.partial({ password: true }).parse({ password });
		} catch (err) {
			const validationError = fromError(err);
			return fail(StatusCodes.BAD_REQUEST, { password: validationError.toString() });
		}

		// Create user
		const hashedPassword = await bcrypt.hash(password, 12);
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
		// TODO Email verification functionality
		// const verifyEmailLink = await createVerifyEmailLink(email);
		// await sendEmail(
		// 	email,
		// 	'Verify your email',
		// 	'Click the link to verify your email' + verifyEmailLink
		// );
		throw redirect(StatusCodes.MOVED_TEMPORARILY, '/login');
		// return { success: true };
	}
};
