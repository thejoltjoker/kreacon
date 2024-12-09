import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm/sql/functions';
import submissions from '$lib/server/db/schema/submission';

export const load = (async ({ url }) => {
	// Add pagination and sorting params
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const pageSize = 30;

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.submissions.findMany({
			with: {
				user: { columns: { username: true } },
				category: { columns: { name: true } },
				thumbnail: { columns: { url: true } }
			},
			orderBy: (items, { asc, desc }) => {
				switch (sortBy) {
					case 'title_asc':
						return asc(items.title);
					case 'title_desc':
						return desc(items.title);
					case 'status_asc':
						return asc(items.status);
					case 'status_desc':
						return desc(items.status);
					case 'username_asc':
						return asc(items.userId);
					case 'username_desc':
						return desc(items.userId);
					case 'category_asc':
						return asc(items.categoryId);
					case 'category_desc':
						return desc(items.categoryId);
					default:
						return [asc(items.status), desc(items.createdAt)];
				}
			},
			limit: pageSize,
			offset: (page - 1) * pageSize
		});

		const [totalCount] = await tx.select({ count: count() }).from(submissions);

		return { submissions: result, totalCount };
	});

	return {
		submissions: result.submissions,
		totalCount: result.totalCount.count
	};
}) satisfies PageServerLoad;
