import type { RequestEvent } from '@sveltejs/kit';
import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { sessions, type InsertSession } from '../db/schema/session';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'session';

export function generateSessionToken() {
	return crypto.randomUUID();
}

export async function createSession(token: string, userId: string) {
	const sessionId = createHash('sha256').update(token).digest('hex');
	const session: InsertSession = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(sessions).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = createHash('sha256').update(token).digest('hex');
	const result = await db.query.sessions.findFirst({
		with: {
			user: {
				with: {
					avatar: { columns: { url: true } }
				},
				columns: {
					password: false
				}
			}
		},
		where: eq(sessions.id, sessionId)
	});

	if (!result) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

	const sessionExpired = Date.now() >= new Date(session.expiresAt).getTime();
	if (sessionExpired) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= new Date(session.expiresAt).getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(sessions)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessions.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
