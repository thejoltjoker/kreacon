import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import reactions, { insertReactionSchema } from '$lib/server/db/schema/reaction';
import { fail } from '@sveltejs/kit';

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

export const actions = {
	react: async ({ params, locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Not signed in' });
		}

		try {
			const formData = await request.formData();
			const submissionId = params.id;
			const userId = locals.user.id;
			const value = formData.get('reaction')?.toString();
			const data = insertReactionSchema.parse({
				submissionId,
				userId,
				value
			});

			await db.insert(reactions).values(data);

			return { success: true };
		} catch (error) {
			console.error('Failed to insert reaction:', error);
			return { success: false, error: 'Failed to save reaction' };
		}
	}
};
