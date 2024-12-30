import db from '$lib/server/db';
import { users } from '$lib/server/db/schema/user';
import { eq, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { entries } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ params, url }) => {
	const username = params.username;
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const page = Number(url.searchParams.get('page') ?? '1');
	const perPage = 8;

	const user = await db.query.users.findFirst({
		where: eq(users.username, username)
	});

	if (!user) {
		throw error(StatusCodes.NOT_FOUND, 'User not found');
	}

	const result = await db.transaction(async (tx) => {
		const entriesResult = await tx.query.entries.findMany({
			where: eq(entries.userId, user.id),
			with: {
				media: true,
				category: true,
				preview: true,
				user: {
					with: { avatar: { columns: { url: true } } },
					columns: {
						username: true,
						picture: true
					}
				}
			},
			orderBy: (items, { asc, desc }) => {
				switch (sortBy) {
					case 'oldest':
						return asc(items.createdAt);
					case 'newest':
						return desc(items.createdAt);
					case 'random':
						return sql`random()`;
					default:
						return desc(items.createdAt);
				}
			},
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const [totalCount] = await tx
			.select({ count: count() })
			.from(entries)
			.where(eq(entries.userId, user.id));

		return { entries: entriesResult, totalCount };
	});

	return {
		entries: result.entries,
		count: result.totalCount.count,
		perPage
	};
}) satisfies PageServerLoad;
