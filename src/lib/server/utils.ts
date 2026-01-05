import { hash, verify } from 'argon2';
import { db } from './db';
import { events, tickets } from './db/schema';
import { eq } from 'drizzle-orm';
import { createBackendLogger } from './logger';

export const argonSettings = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export const verifyPassword = async (hash: string, password: string) =>
	await verify(hash, password);

export const hashPassword = async (password: string) => await hash(password, argonSettings);

const logger = createBackendLogger('user-utils');

// TODO Remove this after Beacon 2026 event
export const assignBeacon2026Ticket = async (userId: string): Promise<void> => {
	try {
		const event = await db.query.events.findFirst({
			where: eq(events.name, 'Beacon 2026')
		});

		if (!event) {
			logger.warn('Beacon 2026 event not found, skipping ticket assignment', { userId });
			return;
		}

		await db
			.insert(tickets)
			.values({
				code: 'BEACON-2026',
				userId,
				eventId: event.id
			})
			.onConflictDoNothing({ target: [tickets.userId, tickets.eventId] });

		logger.info('Assigned Beacon 2026 ticket to new user', { userId, eventId: event.id });
	} catch (error) {
		logger.error('Failed to assign Beacon 2026 ticket to user', {
			userId,
			error: error instanceof Error ? error.message : String(error)
		});
	}
};
