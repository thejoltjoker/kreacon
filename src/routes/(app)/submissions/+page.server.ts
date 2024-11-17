import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const submissions = await db.query.submissions.findMany({
		with: {
			user: true,
			media: true,
			reactions: true
		}
	});
	return { submissions: submissions };
}) satisfies PageServerLoad;
