import db from '$lib/server/db';
import { users } from '$lib/server/db/schema/user';

import { eq, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { submissions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const load = (async ({ params, url }) => {
	const username = params.username;
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const page = Number(url.searchParams.get('page') ?? '1');
	const perPage = 8;

	const user = await db.query.users.findFirst({
		where: eq(users.username, username)
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	const result = await db.transaction(async (tx) => {
		const submissionsResult = await tx.query.submissions.findMany({
			where: eq(submissions.userId, user.id),
			with: {
				media: true,
				category: true,
				thumbnail: true,
				user: {
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
			.from(submissions)
			.where(eq(submissions.userId, user.id));

		return { submissions: submissionsResult, totalCount };
	});

	return {
		submissions: result.submissions,
		count: result.totalCount.count,
		perPage
	};
}) satisfies PageServerLoad;
