import db from '$lib/server/db';
import { users, type PublicUser } from '$lib/server/db/schema/user';

import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { submissions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const load = (async ({ locals, params, url }) => {
	const username = params.username;
	const sortBy = url.searchParams.get('sortBy') ?? 'date_desc';
	const user = await db.query.users.findFirst({
		where: eq(users.username, username)
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	const result = await db.query.submissions.findMany({
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
				case 'date_asc':
					return asc(items.createdAt);
				case 'date_desc':
					return desc(items.createdAt);
				case 'random':
					return sql`random()`;
				default:
					return desc(items.createdAt);
			}
		}
	});

	return { submissions: result };
}) satisfies PageServerLoad;
