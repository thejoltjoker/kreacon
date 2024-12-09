import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const result = await db.query.submissions.findMany({
		with: {
			user: { columns: { username: true } },
			category: { columns: { name: true } },
			thumbnail: { columns: { url: true } }
		}
	});

	return { submissions: result };
}) satisfies PageServerLoad;
