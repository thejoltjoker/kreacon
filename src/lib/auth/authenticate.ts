import { JWT_SIGNATURE } from '$env/static/private';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema.js';
import type { AccessToken } from '$lib/types/AccessToken';
import type { RefreshToken } from '$lib/types/RefreshToken.js';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { createTokens } from './createTokens.js';
import { setCookies } from './setCookies.js';
import { createLogger } from '$lib/logger';
import ServerError from '$lib/ServerError.js';
import { StatusCodes } from 'http-status-codes';
const logger = createLogger('authenticate', import.meta.url);

export const authenticate = async (event: RequestEvent): Promise<AccessToken | null> => {
	if (!JWT_SIGNATURE) {
		logger.error('JWT_SIGNATURE is not set');
		throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, 'JWT_SIGNATURE is not set');
	}

	const cookieAccessToken = event.cookies.get('accessToken');
	const cookieRefreshToken = event.cookies.get('refreshToken');

	if (cookieAccessToken) {
		try {
			const payload = jwt.verify(cookieAccessToken, JWT_SIGNATURE) as AccessToken;

			return payload;
		} catch (error) {
			logger.warn('Failed to verify access token', { error });
		}
	}

	if (cookieRefreshToken) {
		logger.debug('Refresh token found in cookies');
		try {
			const payload = jwt.verify(cookieRefreshToken, JWT_SIGNATURE) as RefreshToken;
			const session = await db.query.sessions.findFirst({
				where: eq(sessions.sessionToken, payload.sessionToken)
			});

			if (!session) {
				logger.warn('Session not found for refresh token');
				event.cookies.delete('refreshToken', { path: '/' });
				event.cookies.delete('accessToken', { path: '/' });
				return null;
			}

			if (session.expiresAt < new Date()) {
				logger.info('Session expired, deleting session and cookies');
				await db.delete(sessions).where(eq(sessions.sessionToken, session.sessionToken));
				event.cookies.delete('refreshToken', { path: '/' });
				event.cookies.delete('accessToken', { path: '/' });
				return null;
			}

			logger.info('Creating new tokens for valid session');
			const { accessToken, refreshToken } = createTokens(session.sessionToken, session.userId);
			setCookies(event.cookies, accessToken, refreshToken, session.expiresAt);

			return { sessionToken: session.sessionToken, userId: session.userId };
		} catch (error) {
			logger.warn('Failed to verify refresh token', { error });
		}
	}

	logger.info('Authentication failed, no valid tokens found');
	return null;
};