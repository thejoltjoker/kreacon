import { createUser } from '$lib/auth/createUser';
import { db } from '$lib/server/db';
import { insertUserSchema, users } from '$lib/server/db/schema';
import {
	hasNumber,
	hasSpecialCharacter,
	isCommonPassword,
	isLongEnough
} from '$lib/validation/password/passwordValidation';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { fromError } from 'zod-validation-error';
import type { Actions, PageServerLoad } from './$types';
import { createLogger } from '$lib/logger';
import { sendEmailVerification } from '$lib/auth/verifyEmail';

const logger = createLogger('register', import.meta.url);

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
			logger.warn('Registration attempt with missing email');
			return fail(StatusCodes.BAD_REQUEST, { email, emailMissing: true });
		}

		try {
			insertUserSchema.partial({ email: true }).parse({ email });
		} catch (err) {
			const validationError = fromError(err);
			logger.warn(`Email validation failed: ${validationError.toString()}`, { email });
			return fail(StatusCodes.BAD_REQUEST, { email: validationError.toString() });
		}

		// Check for existing user
		const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

		if (existingUser) {
			logger.info('Registration attempt with existing email', { email });
			return fail(StatusCodes.BAD_REQUEST, { email: "Couldn't create user" });
		}

		// Validate password
		if (!password) {
			logger.warn('Registration attempt with missing password', { email });
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
		try {
			const user = await createUser(email, password);
			logger.info('Created new user', { userId: user.id, email: user.email });
			if (!user) {
				logger.error('Failed to create user - createUser returned null', { email });
				return error(StatusCodes.INTERNAL_SERVER_ERROR, {
					message: 'Failed to create user'
				});
			}
		} catch (err) {
			logger.error('Failed to create user', { error: err, email });
			return error(StatusCodes.INTERNAL_SERVER_ERROR, {
				message: 'Failed to create user'
			});
		}

		// TODO Email verification functionality
		await sendEmailVerification(email);

		logger.info('User registered successfully, redirecting to login', { email });
		throw redirect(StatusCodes.MOVED_TEMPORARILY, '/login');
	}
};
