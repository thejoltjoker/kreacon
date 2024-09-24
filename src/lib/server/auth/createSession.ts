import { db } from '$lib/server/db';
import { sessions, type InsertSession } from '$lib/server/db/schema';
import ServerError from '$lib/ServerError';
import crypto from 'crypto';

export const createSession = async (userId: string) => {
	try {
		const sessionToken = crypto.randomBytes(32).toString('hex');
		const sessionPayload: InsertSession = {
			sessionToken,
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
		};
		const session = await db.insert(sessions).values(sessionPayload).returning();

		if (!session || session.length === 0) {
			throw new Error('Failed to create session');
		}

		return session[0];
	} catch (error) {
		console.error('Error creating session:', error);
		throw new ServerError(500, 'Failed to create session');
	}
};
