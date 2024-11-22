import { db } from '$lib/server/db';
import { submissions, votes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { user } = locals;
	const { id } = params;

	// const result = await db.query.submissions.findFirst({
	// 	where: eq(submissions.id, id),
	// 	with: {
	// 		media: true,
	// 		reactions: {
	// 			with: {
	// 				user: {
	// 					columns: {
	// 						username: true,
	// 						image: true
	// 					}
	// 				}
	// 			}
	// 		},
	// 		category: true,
	// 		user: {
	// 			columns: {
	// 				username: true,
	// 				image: true
	// 			}
	// 		},
	// 		votes: {
	// 			where: and(eq(votes.submissionId, id), eq(votes.userId, user!.id))
	// 		}
	// 	}
	// });
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
				user: {
					columns: {
						username: true,
						picture: true
					}
				}
			}
			// votes: {
			// 	where: and(eq(votes.submissionId, id), eq(votes.userId, user!.id))
			// }
		}
	});

	return { submission: result };
}) satisfies PageServerLoad;
