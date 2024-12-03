import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const result = await db.query.categories.findMany();
	return { categories: result };
}) satisfies PageServerLoad;
