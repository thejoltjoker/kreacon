import db from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { users } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { adminCheck } from '../../utils';
import { updateUserSchema } from '$lib/server/db/schema/user';
import { createLogger } from '$lib/helpers/logger';
const logger = createLogger('admin/users/[username]/+server.ts');
export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	adminCheck(locals);
	// Supports updating user status and role
	const { username } = params;
	const body = await request.json();
	try {
		const { status, role } = updateUserSchema.parse(body);
		const updateData: { status?: typeof status; role?: typeof role } = {};
		if (status !== undefined) updateData.status = status;
		if (role !== undefined) updateData.role = role;
		await db.update(users).set(updateData).where(eq(users.username, username));
		return new Response(null, { status: StatusCodes.NO_CONTENT });
	} catch (error) {
		logger.error('Failed to update user', error);
		return json({ error: 'Invalid request body' }, { status: StatusCodes.BAD_REQUEST });
	}
};
