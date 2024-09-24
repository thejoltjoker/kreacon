import { createUser } from '$lib/auth/createUser';
import { createLogger } from '$lib/logger';
import { userRegistrationSchema } from '$lib/schemas/userRegistrationSchema';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const logger = createLogger('register');

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	store: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { email, password } = formData;

		try {
			const result = await userRegistrationSchema.parseAsync(formData);
			logger.info('Form data parsed successfully', { result });
		} catch (err: unknown) {
			logger.error('Form data validation error', { error: err });

			// Check if the error object has a structure similar to ZodError
			if (typeof err === 'object' && err !== null && 'issues' in err) {
				const zodError = err as z.ZodError;
				const { fieldErrors: errors } = zodError.flatten();
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { password, confirmPassword, ...cleanFormData } = formData;
				console.log(errors);
				return fail(400, { data: cleanFormData, errors });
			} else {
				// Handle other types of errors
				return fail(500, { message: 'An unexpected error occurred' });
			}
		}

		// Check for existing user
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email.toString())
		});

		if (existingUser) {
			logger.info('Registration attempt with existing email', { email });
			return fail(400, {
				errors: { email: 'Try a different email' }
			});
		}

		// Create user
		try {
			const user = await createUser(email.toString(), password.toString());
			logger.info('Created new user', { userId: user.id, email: user.email });
			if (!user) {
				logger.error('Failed to create user - createUser returned null', { email });
				return error(500, {
					message: 'Failed to create user'
				});
			}
		} catch (err) {
			logger.error('Failed to create user', { error: err, email });
			return error(500, {
				message: 'Failed to create user'
			});
		}

		// TODO Email verification functionality
		// await sendEmailVerification(email.toString());

		logger.info('User registered successfully, redirecting to login', { email });
		throw redirect(302, '/login');
	}
};
