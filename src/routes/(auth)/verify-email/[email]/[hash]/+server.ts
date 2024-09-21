import { createVerifyEmailToken } from '$lib/auth/verifyEmail';
import { createLogger } from '$lib/logger';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const logger = createLogger('verify-email');

export const GET: RequestHandler = async ({ params }) => {
	const { email, hash } = params;
	logger.info('Verifying email', { email, hash });
	const token = await createVerifyEmailToken(email);
	if (token !== hash) {
		logger.error('Invalid token');
		throw error(401, 'Invalid token');
	}

	const updatedUser = await db
		.update(users)
		.set({ emailVerifiedAt: new Date() })
		.where(eq(users.email, email))
		.returning();

	if (!updatedUser || updatedUser.length === 0) {
		logger.error('User not found');
		throw error(404, 'User not found');
	}

	logger.info('Email verified');
	throw redirect(302, '/');
};
