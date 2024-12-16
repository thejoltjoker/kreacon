import db from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { adminCheck } from '../../../utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	adminCheck(locals);
	await db.delete(events).where(eq(events.id, Number(params.id)));
	return new Response();
};
