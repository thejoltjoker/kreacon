import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { id } = params;

	const result = await db.query.submissions.findFirst({
		where: eq(submissions.id, id),
		with: {
			media: true,
			category: true,
			user: {
				columns: {
					username: true,
					picture: true
				}
			},
			reactions: {
				with: {
					user: {
						columns: {
							username: true,
							picture: true
						}
					}
				}
			}
			// votes: {
			// 	where: and(eq(votes.submissionId, id), eq(votes.userId, user!.id))
			// }
		}
	});

	return { submission: result, user: locals.user };
}) satisfies PageServerLoad;
