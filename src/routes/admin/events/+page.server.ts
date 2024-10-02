import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const events = await db.query.events.findMany();

	return { events };
}) satisfies PageServerLoad;
