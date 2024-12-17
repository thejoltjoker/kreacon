import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { adminCheck } from '../utils';
import type { PageServerLoad } from './$types';
import { tickets, users } from '$lib/server/db/schema';

export const load = (async ({ locals, url }) => {
	adminCheck(locals);
	const username = url.searchParams.get('username');
	let user;
	if (username != null) {
		user = await db.query.users.findFirst({
			where: eq(users.username, username)
		});
	}
	const result = await db.query.tickets.findMany({
		with: {
			user: { columns: { username: true, email: true, id: true } },
			event: { columns: { name: true, id: true } }
		},
		where: user ? eq(tickets.userId, user.id) : undefined
	});

	return { tickets: result, title: { text: 'Tickets', href: '/admin/tickets' } };
}) satisfies PageServerLoad;
