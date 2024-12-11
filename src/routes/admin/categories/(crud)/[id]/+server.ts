import db from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { adminCheck } from '../../../utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	adminCheck(locals);
	await db.delete(categories).where(eq(categories.id, Number(params.id)));
	return new Response();
};
