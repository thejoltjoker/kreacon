import db from '$lib/server/db';
import { entries } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { adminCheck } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import { entryStatus } from '$lib/types/entryStatus';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
	adminCheck(locals);
	const id = params.id;
	try {
		z.string().min(1).max(255).parse(params.id);
	} catch (error) {
		console.error(error);
		return json({ error: 'Invalid ID' }, { status: StatusCodes.BAD_REQUEST });
	}

	const { status } = await request.json();

	if (!entryStatus.includes(status)) {
		return json({ error: 'Invalid status' }, { status: StatusCodes.BAD_REQUEST });
	}

	await db.update(entries).set({ status }).where(eq(entries.id, id));

	return new Response(null, { status: StatusCodes.NO_CONTENT });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	adminCheck(locals);
	const id = params.id;
	await db.delete(entries).where(eq(entries.id, id));
	return new Response(null, { status: StatusCodes.NO_CONTENT });
};
