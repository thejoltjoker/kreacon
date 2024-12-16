import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm/sql/functions';
import submissions from '$lib/server/db/schema/submission';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const getDefaultSort = (sortBy: string, items: any, asc: any, desc: any) => {
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
		case 'createdAt_asc':
			return asc(items.createdAt);
		case 'createdAt_desc':
			return desc(items.createdAt);
		default:
			return [desc(items.status), desc(items.createdAt)];
	}
};

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const event = url.searchParams.get('event');
	const searchQuery = url.searchParams.get('q');
	const perPage = 30;

	const result = await db.transaction(async (tx) => {
		let query = tx.query.submissions.findMany({
			with: {
				user: { columns: { username: true } },
				category: { columns: { name: true } },
				thumbnail: { columns: { url: true } },
				event: { columns: { id: true, name: true } }
			},
			where(fields) {
				if (event && searchQuery) {
					return sql`${eq(fields.eventId, Number(event))} AND 
						to_tsvector('english', ${fields.title}) @@ websearch_to_tsquery('english', ${searchQuery})`;
				} else if (searchQuery) {
					return sql`to_tsvector('english', ${fields.title}) @@ websearch_to_tsquery('english', ${searchQuery})`;
				} else if (event) {
					return eq(fields.eventId, Number(event));
				}
			},
			orderBy: (items, { asc, desc }) => {
				if (searchQuery) {
					return [
						desc(
							sql`ts_rank(to_tsvector('english', ${items.title}),
								websearch_to_tsquery('english', ${searchQuery}))`
						),
						getDefaultSort(sortBy, items, asc, desc)
					];
				}
				return getDefaultSort(sortBy, items, asc, desc);
			},
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const result = await query;

		const [totalCount] = await tx
			.select({ count: count() })
			.from(submissions)
			.where(
				searchQuery
					? sql`to_tsvector('english', ${submissions.title}) @@ websearch_to_tsquery('english', ${searchQuery})`
					: event
						? eq(submissions.eventId, Number(event))
						: undefined
			);

		return {
			submissions: result,
			totalCount
		};
	});

	return {
		submissions: result.submissions.flatMap((submission) => ({
			id: submission.id,
			title: submission.title,
			username: submission.user.username,
			category: submission.category.name,
			event: submission.event.name,
			status: submission.status,
			thumbnailUrl: submission.thumbnail.url,
			createdAt: submission.createdAt
		})),
		events: Array.from(
			new Map(
				result.submissions
					.filter((submission) => submission.event.id != null)
					.map((submission) => [submission.event.id, submission.event])
			).values()
		),
		pagination: {
			page,
			perPage,
			count: result.totalCount.count
		},
		title: { text: 'Submissions', href: '/admin/submissions' }
	};
}) satisfies PageServerLoad;
