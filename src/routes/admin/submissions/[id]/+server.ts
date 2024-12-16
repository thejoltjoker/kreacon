import db from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { adminCheck } from '../../utils';
import { StatusCodes } from 'http-status-codes';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
	adminCheck(locals);
	const id = params.id;
	const { status } = await request.json();

	await db.update(submissions).set({ status }).where(eq(submissions.id, id));

	return new Response(null, { status: StatusCodes.NO_CONTENT });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	adminCheck(locals);
	const id = params.id;
	await db.delete(submissions).where(eq(submissions.id, id));
	return new Response(null, { status: StatusCodes.NO_CONTENT });
};
