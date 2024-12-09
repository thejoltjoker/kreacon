import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const tickets = await db.query.tickets.findMany({
		with: {
			user: { columns: { username: true, email: true, id: true } },
			event: { columns: { name: true, id: true } }
		}
	});

	return { tickets };
}) satisfies PageServerLoad;
