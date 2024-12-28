import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm/sql/functions';
import users from '$lib/server/db/schema/user';

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'username_asc';
	const perPage = 30;

	const queryResult = await db.transaction(async (tx) => {
		const usersResult = await tx.query.users.findMany({
			orderBy: (items, { asc, desc }) => {
				switch (sortBy) {
					case 'username_asc':
						return asc(items.username);
					case 'username_desc':
						return desc(items.username);
					case 'role_asc':
						return asc(items.role);
					case 'role_desc':
						return desc(items.role);
					case 'createdAt_asc':
						return asc(items.createdAt);
					case 'createdAt_desc':
						return desc(items.createdAt);
					default:
						return asc(items.username);
				}
			},
			with: {
				tickets: { columns: { id: true } },
				entries: { columns: { id: true } }
			},
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const [totalCount] = await tx.select({ count: count() }).from(users);

		return { users: usersResult, totalCount };
	});

	return {
		users: queryResult.users,
		pagination: {
			page,
			perPage,
			count: queryResult.totalCount.count
		},
		title: { text: 'Users', href: '/admin/users' }
	};
}) satisfies PageServerLoad;
