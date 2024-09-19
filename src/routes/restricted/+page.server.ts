import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const result = await db.select().from(users);
	return { result };
}) satisfies PageServerLoad;
