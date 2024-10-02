import { userRegistrationSchema } from '$lib/schemas/userRegistrationSchema';
import { createUser } from '$lib/server/auth/createUser';
import { availableOAuthProviders } from '$lib/server/auth/oauth/getOAuthClient';
import { sendEmailVerification } from '$lib/server/auth/verifyEmail';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { createLogger } from '$lib/server/logger';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';
import type { PageServerLoad } from './$types';

const logger = createLogger('register');

export const load = (async () => {
	const providers = availableOAuthProviders();
	logger.info('Available OAuth providers', { providers });
	return { providers };
}) satisfies PageServerLoad;

export const actions: Actions = {
	store: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { email, password } = formData;

		// Validate form data
		try {
			const result = await userRegistrationSchema.parseAsync(formData);
			logger.info('Form data parsed successfully', result);
		} catch (err: unknown) {
			logger.error('Form data validation error', { error: err });

			if (typeof err === 'object' && err !== null && 'issues' in err) {
				const zodError = err as z.ZodError;
				const { fieldErrors: errors } = zodError.flatten();
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { password, ...cleanFormData } = formData;
				return fail(400, { data: cleanFormData, errors });
			} else {
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

		await sendEmailVerification(email.toString());

		logger.info('User registered successfully, redirecting to login', { email });
		throw redirect(302, '/login');
	}
};