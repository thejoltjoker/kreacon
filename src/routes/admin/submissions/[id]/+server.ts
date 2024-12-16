import db from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { adminCheck } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import { submissionStatus } from '$lib/types/submissionStatus';
import { json } from '@sveltejs/kit';
import { insertSubmissionSchema, updateSubmissionSchema } from '$lib/server/db/schema/submission';
import { z } from 'zod';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
	adminCheck(locals);
	const id = params.id;
	try {
		z.string().min(1).max(255).parse(params.id);
	} catch (error) {
		return json({ error: 'Invalid ID' }, { status: StatusCodes.BAD_REQUEST });
	}

	const { status } = await request.json();

	if (!submissionStatus.includes(status)) {
		return json({ error: 'Invalid status' }, { status: StatusCodes.BAD_REQUEST });
	}

	await db.update(submissions).set({ status }).where(eq(submissions.id, id));

	return json(null, { status: StatusCodes.NO_CONTENT });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	adminCheck(locals);
	const id = params.id;
	await db.delete(submissions).where(eq(submissions.id, id));
	return json(null, { status: StatusCodes.NO_CONTENT });
};
