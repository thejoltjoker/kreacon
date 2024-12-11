import db from '$lib/server/db';
import { reactions, users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ params, url }) => {
	const username = params.username;
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const user = await db.query.users.findFirst({
		where: eq(users.username, username)
	});
	if (!user) {
		throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	}
	const result = await db.query.reactions.findMany({
		where: eq(reactions.userId, user.id),
		with: {
			submission: {
				columns: {
					id: true
				},
				with: {
					thumbnail: true
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
		}
	});
	return { reactions: result };
}) satisfies PageServerLoad;
