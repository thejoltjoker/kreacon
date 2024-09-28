import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const eventId = Number(params.id);
	const result = await db.query.submissions.findMany({
		where: eq(submissions.eventId, eventId),
		with: {
			category: true,
			votes: true,
			reactions: true,
			media: true,
			user: true
		}
	});

	// console.log(result);
	return { submissions: result };
}) satisfies PageServerLoad;
