import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import db from '$lib/server/db';
import { createLogger } from '$lib/helpers/logger';
const logger = createLogger('landing-page-server');
export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/submissions');
	}

	const now = new Date();
	const events = await db.query.events.findMany({
		where(fields, { eq, lte, gte, and, or, not }) {
			return or(gte(fields.submissionsCloseAt, now), gte(fields.votingCloseAt, now));
		},
		orderBy(fields, { asc }) {
			return [asc(fields.submissionsOpenAt)];
		}
	});

	logger.info('events', events);
	return { events, title: { text: 'Kreacon' } };
}) satisfies PageServerLoad;
