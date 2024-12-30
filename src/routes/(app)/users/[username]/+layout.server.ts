import db from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { desc, eq, and } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import entries from '$lib/server/db/schema/entry';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const result = await db.transaction(async (tx) => {
		const user = await tx.query.users.findFirst({
			where: eq(users.username, params.username),
			columns: {
				username: true,
				id: true,
				createdAt: true
			},
			with: {
				avatar: { columns: { url: true } },
				entries: {
					columns: {
						id: true
					}
				},
				tickets: {
					columns: {
						eventId: true
					}
				}
			}
		});

		if (!user) {
			throw error(StatusCodes.NOT_FOUND, 'User not found');
		}

		const entriesResult = await tx.query.entries.findMany({
			where: and(
				eq(entries.userId, user.id),
				locals.user?.id !== user.id ? eq(entries.status, 'published') : undefined
			),
			orderBy: desc(entries.createdAt),
			with: {
				media: true
			}
		});

		return {
			profileUser: {
				username: user.username,
				avatar: user.avatar,
				entryCount: user.entries.length,
				ticketCount: user.tickets.length,
				createdAt: user.createdAt
			},
			entries: entriesResult,
			title: { text: 'User', href: `/users/${user.username}` }
		};
	});

	return result;
}) satisfies LayoutServerLoad;
