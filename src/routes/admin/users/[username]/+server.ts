import db from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { users } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { adminCheck } from '../../utils';
import { updateUserSchema } from '$lib/server/db/schema/user';

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	adminCheck(locals);
	// Currently only supports banning users
	const { username } = params;
	const body = await request.json();
	try {
		const { banned } = updateUserSchema.parse(body);
		await db.update(users).set({ banned }).where(eq(users.username, username));
		return json(null, { status: StatusCodes.NO_CONTENT });
	} catch (error) {
		return json({ error: 'Invalid request body' }, { status: StatusCodes.BAD_REQUEST });
	}
};
