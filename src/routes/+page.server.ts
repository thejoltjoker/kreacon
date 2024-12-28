import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import db from '$lib/server/db';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/entries');
	}

	const now = new Date();
	const events = await db.query.events.findMany({
		where(fields, { gte, or }) {
			return or(gte(fields.submissionsCloseAt, now), gte(fields.votingCloseAt, now));
		},
		with: {
			eventCategories: { columns: { categoryId: true } }
		},
		orderBy(fields, { asc }) {
			return [asc(fields.submissionsOpenAt)];
		}
	});

	return { events, title: { text: 'Kreacon' } };
}) satisfies PageServerLoad;
