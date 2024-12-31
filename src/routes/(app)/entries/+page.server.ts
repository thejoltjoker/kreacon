import { db } from '$lib/server/db';
import { count } from 'drizzle-orm/sql/functions';
import type { PageServerLoad } from './$types';
import entries from '$lib/server/db/schema/entry';
import { and, eq, or, sql } from 'drizzle-orm';

// TODO Handling invalid page numbers
// TODO Combining pagination with filtering/sorting

export const load = (async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const event = url.searchParams.get('event');
	const category = url.searchParams.get('category');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const pageSize = 30;

	const queryResult = await db.transaction(async (tx) => {
		const result = await tx.query.entries.findMany({
			with: {
				user: {
					with: { avatar: { columns: { url: true } } },
					columns: { id: true, username: true }
				},
				media: true,
				reactions: true,
				category: true,
				preview: { columns: { url: true } }
			},
			where: (table, { or, eq }) =>
				and(
					locals.user
						? or(eq(table.userId, locals.user.id), eq(table.status, 'published'))
						: eq(table.status, 'published'),
					event ? eq(table.eventId, Number(event)) : undefined,
					category ? eq(table.categoryId, Number(category)) : undefined
					// TODO Filter out banned users submissions
				),
			orderBy: (items, { asc, desc }) => {
				switch (sortBy) {
					case 'oldest':
						return asc(items.createdAt);
					case 'newest':
						return desc(items.createdAt);
					// TODO Sort by reactions count
					// case 'reactions_asc':
					// 	return asc(count(items.reactions));
					// case 'reactions_desc':
					// 	return desc(count(items.reactions));
					case 'random':
						return sql`random()`;
					default:
						return asc(items.createdAt);
				}
			},
			limit: pageSize,
			offset: (page - 1) * pageSize
		});

		const [totalCount] = await tx
			.select({ count: count() })
			.from(entries)
			.where(
				and(
					locals.user
						? or(eq(entries.userId, locals.user.id), eq(entries.status, 'published'))
						: eq(entries.status, 'published'),
					event ? eq(entries.eventId, Number(event)) : undefined,
					category ? eq(entries.categoryId, Number(category)) : undefined
				)
			);

		return { entries: result, totalCount };
	});

	const categories = await db.query.categories.findMany({
		with: { eventCategories: { with: { event: { columns: { name: true, id: true } } } } }
	});
	const events = Array.from(
		new Map(
			categories
				.flatMap((c) => c.eventCategories.map((ctoe) => ctoe.event))
				.map((event) => [event.id, event])
		).values()
	).sort((a, b) => (a.name > b.name ? 1 : -1));
	return {
		entries: queryResult.entries,
		totalCount: queryResult.totalCount.count,
		categories,
		user: locals.user,
		events
	};
}) satisfies PageServerLoad;
