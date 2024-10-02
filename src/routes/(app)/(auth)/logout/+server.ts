import { JWT_SIGNATURE } from '$env/static/private';
import { createLogger } from '$lib/server/logger';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import type { RefreshToken } from '$lib/types/RefreshToken';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from './$types';

const logger = createLogger('logout');

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const refreshToken = cookies.get('refreshToken');
		if (refreshToken) {
			try {
				const { sessionToken } = jwt.verify(refreshToken, JWT_SIGNATURE) as RefreshToken;
				const result = await db
					.delete(sessions)
					.where(eq(sessions.sessionToken, sessionToken))
					.returning();
				logger.info(`Session deleted: ${result.length} row(s) affected`);
			} catch (error) {
				logger.warn('Invalid refresh token', { error: (error as Error).message });
			}
		} else {
			logger.info('No refresh token found in cookies');
		}

		cookies.delete('refreshToken', { path: '/' });
		cookies.delete('accessToken', { path: '/' });
		logger.info('Logout successful');
	} catch (err) {
		logger.error('Logout failed', { error: (err as Error).message });
		return error(500, { message: 'Logout failed' });
	}

	throw redirect(302, '/');
};