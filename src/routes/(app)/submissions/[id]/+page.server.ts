import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const result = await db.query.submissions.findFirst({
		where: eq(submissions.eventId, +params.id)
	});
	console.log(result);
	return { submission: result };
}) satisfies PageServerLoad;
