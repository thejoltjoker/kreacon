import { db } from '$lib/server/db';
import { sessions, type InsertSession } from '$lib/server/db/schema';
import ServerError from '$lib/ServerError';
import * as crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

export const createSession = async (userId: string) => {
	try {
		const sessionId = crypto.randomBytes(32).toString('hex');
		const sessionPayload: InsertSession = {
			sessionToken: sessionId,
			userId,
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
		};
		const session = await db.insert(sessions).values(sessionPayload).returning();

		if (!session || session.length === 0) {
			throw new Error('Failed to create session');
		}

		return session[0];
	} catch (error) {
		console.error('Error creating session:', error);
		throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create session');
	}
};
