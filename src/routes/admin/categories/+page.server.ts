import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm/sql/functions';
import categories from '$lib/server/db/schema/category';

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const perPage = 30;

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.categories.findMany({
			orderBy: (items, { asc, desc }) => {
				switch (sortBy) {
					case 'name_asc':
						return asc(items.name);
					case 'name_desc':
						return desc(items.name);
					case 'mediaType_asc':
						return asc(items.mediaType);
					case 'mediaType_desc':
						return desc(items.mediaType);
					default:
						return asc(items.name);
				}
			},
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const [totalCount] = await tx.select({ count: count() }).from(categories);

		return { categories: result, totalCount };
	});

	return {
		categories: result.categories,
		pagination: {
			page,
			perPage,
			count: result.totalCount.count
		},
		title: { text: 'Categories', href: '/admin/categories' }
	};
}) satisfies PageServerLoad;
