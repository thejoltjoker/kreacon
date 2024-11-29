import { db } from '$lib/server/db';
import { count } from 'drizzle-orm/sql/functions';
import type { PageServerLoad } from './$types';
import submissions from '$lib/server/db/schema/submission';

// TODO Handling invalid page numbers
// TODO Combining pagination with filtering/sorting

export const load = (async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'date_asc';
	const pageSize = 6;

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.submissions.findMany({
			with: {
				user: true,
				media: true,
				reactions: true,
				category: true
			},
			orderBy: (items, { asc, desc }) => {
				switch (sortBy) {
					case 'date_asc':
						return asc(items.createdAt);
					case 'date_desc':
						return desc(items.createdAt);
					default:
						return asc(items.createdAt);
				}
			},
			limit: pageSize,
			offset: (page - 1) * pageSize
		});

		const [totalCount]: {
			count: number;
		}[] = await tx.select({ count: count() }).from(submissions);

		return { submissions: result, totalCount };
	});
	console.log(result);
	const categories = await db.query.categories.findMany({
		with: { categoriesToEvents: { with: { event: { columns: { name: true, id: true } } } } }
	});

	return {
		submissions: result.submissions,
		totalCount: result.totalCount.count,
		categories,
		user: locals.user
	};
}) satisfies PageServerLoad;
