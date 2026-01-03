import db from '$lib/server/db';
import { desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

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
			return [
				desc(sql`CASE WHEN ${fields.slug} ILIKE 'beacon%' THEN 1 ELSE 0 END`),
				asc(fields.submissionsOpenAt)
			];
		}
	});

	return { events, title: { text: 'Kreacon' } };
}) satisfies PageServerLoad;
