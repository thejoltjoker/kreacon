import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const submission = await db.query.submissions.findFirst({
		where: eq(events.id, params.id)
	});
	console.log(submission);
	return { submission };
}) satisfies PageServerLoad;
