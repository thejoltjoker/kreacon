import { db } from '$lib/server/db';
import { submissions, votes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { user } = locals;
	// console.log(user);

	const result = await db.query.submissions.findFirst({
		where: eq(submissions.id, params.id),
		with: {
			media: true,
			reactions: {
				with: {
					user: {
						columns: {
							username: true,
							image: true
						}
					}
				}
			},
			category: true,
			user: {
				columns: {
					username: true,
					image: true
				}
			},
			votes: {
				where: and(eq(votes.submissionId, params.id), eq(votes.userId, user!.id))
			}
		}
	});
	console.log(result);
	return { submission: result };
}) satisfies PageServerLoad;
