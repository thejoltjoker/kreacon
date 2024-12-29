import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const events = await db.query.events.findMany({
		with: { eventCategories: { columns: { id: true } }, tickets: { columns: { id: true } } }
	});
	return {
		events: events.map(({ tickets, ...event }) => ({
			...event,
			participants: tickets.length
		}))
	};
}) satisfies PageServerLoad;
