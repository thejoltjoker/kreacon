import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';

import reactions, { insertReactionSchema } from '$lib/server/db/schema/reaction';
import { fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { id } = params;

	const result = await db.transaction(async (tx) => {
		await tx
			.update(submissions)
			.set({ views: sql`${submissions.views} + 1` })
			.where(eq(submissions.id, id));

		return await tx.query.submissions.findFirst({
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
			}
		});
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
