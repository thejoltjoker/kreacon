import { createVerifyEmailToken, TOKEN_VALIDITY_MS } from '$lib/server/auth/verifyEmail';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { selectUserSchema } from '$lib/server/db/schema/user';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { createBackendLogger } from '$lib/server/logger';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

const logger = createBackendLogger('verify-email');

const emailSchema = selectUserSchema.shape.email;

export const GET: RequestHandler = async ({ params, url }) => {
	const { email: rawEmail, hash } = params;
	const timestampParam = url.searchParams.get('t');

	// TODO Add rate limiting to prevent brute force attacks

	// TODO Remove sensitive data from logs
	logger.info('Email verification attempt');

	let email: string;
	try {
		email = decodeURIComponent(rawEmail);
		emailSchema.parse(email);
	} catch (err) {
		logger.error('Invalid email format', { error: err });
		throw error(StatusCodes.UNAUTHORIZED, 'Invalid verification link');
	}

	if (!timestampParam) {
		logger.error('Missing timestamp parameter');
		throw error(StatusCodes.UNAUTHORIZED, 'Invalid verification link');
	}

	const timestamp = parseInt(timestampParam, 10);
	if (isNaN(timestamp)) {
		logger.error('Invalid timestamp parameter');
		throw error(StatusCodes.UNAUTHORIZED, 'Invalid verification link');
	}

	const now = Date.now();
	if (timestamp > now || now - timestamp > TOKEN_VALIDITY_MS) {
		logger.error('Token expired or invalid timestamp');
		throw error(StatusCodes.UNAUTHORIZED, 'Verification link has expired');
	}

	// TODO Add token binding to user ID for additional security, not only email and timestamp
	const { token: expectedToken } = createVerifyEmailToken(email, timestamp);

	const EXPECTED_TOKEN_LENGTH = 64;
	const expectedBuffer = Buffer.alloc(EXPECTED_TOKEN_LENGTH);
	const hashBuffer = Buffer.alloc(EXPECTED_TOKEN_LENGTH);

	Buffer.from(expectedToken).copy(expectedBuffer);
	Buffer.from(hash).copy(hashBuffer);

	const buffersMatch = crypto.timingSafeEqual(expectedBuffer, hashBuffer);

	const isValidToken = buffersMatch && hash.length === EXPECTED_TOKEN_LENGTH;

	if (!isValidToken) {
		logger.error('Invalid token');
		throw error(StatusCodes.UNAUTHORIZED, 'Invalid verification link');
	}

	// TODO Store used tokens in database and reject if already used
	const updatedUser = await db
		.update(users)
		.set({ emailVerifiedAt: new Date() })
		.where(eq(users.email, email))
		.returning();

	if (!updatedUser || updatedUser.length === 0) {
		logger.error('User not found');
		throw error(StatusCodes.UNAUTHORIZED, 'Invalid verification link');
	}

	if (updatedUser.length > 1) {
		logger.error('Multiple users updated - data integrity issue', { count: updatedUser.length });
		throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
	}

	logger.info('Email verified successfully');
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
};
