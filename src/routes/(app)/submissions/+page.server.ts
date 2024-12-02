import { db } from '$lib/server/db';
import { count } from 'drizzle-orm/sql/functions';
import type { PageServerLoad } from './$types';
import submissions from '$lib/server/db/schema/submission';
import { eq, or } from 'drizzle-orm';

// TODO Handling invalid page numbers
// TODO Combining pagination with filtering/sorting

export const load = (async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'date_asc';
	const pageSize = 30;

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.submissions.findMany({
			with: {
				user: { columns: { id: true, username: true, picture: true } },
				media: true,
				reactions: true,
				category: true
			},
			where: (submissions, { or, eq }) =>
				locals.user
					? or(eq(submissions.userId, locals.user.id), eq(submissions.status, 'published'))
					: eq(submissions.status, 'published'),
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

		const [totalCount] = await tx
			.select({ count: count() })
			.from(submissions)
			.where(
				locals.user
					? or(eq(submissions.userId, locals.user.id), eq(submissions.status, 'published'))
					: eq(submissions.status, 'published')
			);

		return { submissions: result, totalCount };
	});

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
