import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { adminCheck } from '../utils';
import type { PageServerLoad } from './$types';
import { tickets, users } from '$lib/server/db/schema';
import { count } from 'drizzle-orm/sql/functions';
import type { User } from '$lib/server/db/schema/user';

export const load = (async ({ locals, url }) => {
	adminCheck(locals);
	// Add pagination and sorting params
	const page = Number(url.searchParams.get('page') ?? '1');
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const username = url.searchParams.get('username');
	const event = url.searchParams.get('event');
	const perPage = 48;

	let user: User | undefined;
	if (username != null) {
		user = await db.query.users.findFirst({
			where: eq(users.username, username)
		});
	}

	const result = await db.transaction(async (tx) => {
		const result = await tx.query.tickets.findMany({
			with: {
				user: { columns: { username: true, email: true, id: true } },
				event: { columns: { name: true, id: true } }
			},
			where(fields) {
				if (user && event) {
					return eq(fields.userId, user.id) && eq(fields.eventId, Number(event));
				} else if (user) {
					return eq(fields.userId, user.id);
				} else if (event) {
					return eq(fields.eventId, Number(event));
				}
				return undefined;
			},
			orderBy: (items, { desc }) => {
				switch (sortBy) {
					default:
						return desc(items.createdAt);
				}
			},
			limit: perPage,
			offset: (page - 1) * perPage
		});

		const [totalCount] = await tx
			.select({ count: count() })
			.from(tickets)
			.where(
				user && event
					? eq(tickets.userId, user.id) && eq(tickets.eventId, Number(event))
					: user
						? eq(tickets.userId, user.id)
						: event
							? eq(tickets.eventId, Number(event))
							: undefined
			);

		return { tickets: result, totalCount };
	});

	return {
		tickets: result.tickets,
		events: Array.from(
			new Map(result.tickets.map((ticket) => [ticket.event.id, ticket.event])).values()
		),
		pagination: {
			page,
			perPage,
			count: result.totalCount.count
		},
		title: { text: 'Tickets', href: '/admin/tickets' }
	};
}) satisfies PageServerLoad;
