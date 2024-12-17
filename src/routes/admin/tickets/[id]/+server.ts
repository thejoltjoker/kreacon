import db from '$lib/server/db';
import { tickets } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { insertTicketSchema } from '$lib/server/db/schema/ticket';
import { json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { createLogger } from '$lib/helpers/logger';

const logger = createLogger('admin/tickets/[id]');

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		insertTicketSchema.pick({ id: true }).parse({ id: params.id });
	} catch (error) {
		logger.error('Invalid ticket ID', error);
		return json({ error: 'Invalid ticket ID' }, { status: StatusCodes.BAD_REQUEST });
	}

	await db.delete(tickets).where(eq(tickets.id, params.id));
	return new Response(null, { status: StatusCodes.NO_CONTENT });
};
