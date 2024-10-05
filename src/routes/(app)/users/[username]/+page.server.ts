import { db } from '$lib/server/db';
import { desc, eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';
import { submissions, users } from '$lib/server/db/schema';

export const load = (async ({ params }) => {
	const user = await db.query.users.findFirst({
		where: eq(users.username, params.username),
		with: {
			submissions: {
				orderBy: desc(submissions.createdAt)
			}
		}
	});

	return { user: user };
}) satisfies PageServerLoad;
