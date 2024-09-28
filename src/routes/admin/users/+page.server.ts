import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const users = await db.query.users.findMany();
	console.log(users);
	return { users };
}) satisfies PageServerLoad;
