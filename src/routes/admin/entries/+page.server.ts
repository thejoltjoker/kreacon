import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm/sql/functions';
import entries from '$lib/server/db/schema/entry';
import { eq } from 'drizzle-orm';
import { adminCheck } from '../utils';

export const load = (async ({ locals, url }) => {
	adminCheck(locals);
	// Add pagination and sorting params
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const event = url.searchParams.get('event');
	const perPage = 30;

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.entries.findMany({
			with: {
				user: { columns: { username: true } },
				category: { columns: { name: true } },
				preview: { columns: { url: true } },
				media: { columns: { url: true, name: true } },
				proof: { columns: { url: true, name: true } },
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
					case 'createdAt_asc':
						return asc(items.createdAt);
					case 'createdAt_desc':
						return desc(items.createdAt);
					default:
						return [asc(items.status), desc(items.createdAt)];
				}
			},
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const [totalCount] = await tx
			.select({ count: count() })
			.from(entries)
			.where(event ? eq(entries.eventId, Number(event)) : undefined);

		return {
			entries: result,
			totalCount
		};
	});

	return {
		entries: result.entries.flatMap((entry) => ({
			id: entry.id,
			title: entry.title,
			username: entry.user.username,
			category: entry.category.name,
			event: entry.event.name,
			status: entry.status,
			thumbnailUrl: entry.preview.url,
			mediaUrl: entry.media?.url,
			mediaName: entry.media?.name,
			proofUrl: entry.proof?.url,
			proofName: entry.proof?.name,
			createdAt: entry.createdAt
		})),
		events: Array.from(
			new Map(
				result.entries
					.filter((entry) => entry.event.id != null)
					.map((entry) => [entry.event.id, entry.event])
			).values()
		),
		pagination: {
			page,
			perPage,
			count: result.totalCount.count
		},
		title: { text: 'Entries', href: '/admin/entries' }
	};
}) satisfies PageServerLoad;
