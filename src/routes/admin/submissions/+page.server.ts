import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm/sql/functions';
import submissions from '$lib/server/db/schema/submission';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	// Add pagination and sorting params
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const event = url.searchParams.get('event');
	const perPage = 30;

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.submissions.findMany({
			with: {
				user: { columns: { username: true } },
				category: { columns: { name: true } },
				thumbnail: { columns: { url: true } },
				event: { columns: { id: true, name: true } }
			},
			where(fields) {
				if (event) {
					return eq(fields.eventId, Number(event));
				}
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
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const [totalCount] = await tx
			.select({ count: count() })
			.from(submissions)
			.where(event ? eq(submissions.eventId, Number(event)) : undefined);

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
			thumbnailUrl: submission.thumbnail.url
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
