import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async () => {
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
