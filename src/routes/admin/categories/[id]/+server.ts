import db from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { adminCheck } from '../../utils';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const DELETE: RequestHandler = async ({ request, params, locals }) => {
	adminCheck(locals);
	await db.delete(categories).where(eq(categories.id, Number(params.id)));
	return new Response();
};
