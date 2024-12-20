import { db } from '$lib/server/db';
import { submissions } from '$lib/server/db/schema';

import reactions, { insertReactionSchema } from '$lib/server/db/schema/reaction';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import votes, { insertVoteSchema } from '$lib/server/db/schema/vote';
import { StatusCodes } from 'http-status-codes';

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
				event: {
					columns: {
						id: true,
						name: true,
						slug: true
					}
				},
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
				},
				votes: locals.user
					? {
							where: eq(votes.userId, locals.user.id)
						}
					: undefined
			}
		});
	});

	const isVoted = Boolean(result?.votes && result?.votes.length > 0);

	const title = { text: 'Submissions', href: `/submissions` };
	return { submission: result, user: locals.user, isVoted, title };
}) satisfies PageServerLoad;

export const actions = {
	vote: async ({ params, locals }) => {
		if (!locals.user || !locals.session) {
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
		}

		try {
			const submissionId = params.id;
			const userId = locals.user.id;

			const data = insertVoteSchema.parse({
				submissionId,
				userId
			});

			await db.insert(votes).values(data).onConflictDoNothing();

			return { success: true };
		} catch (error) {
			console.error('Failed to insert vote:', error);
			return { success: false, error: 'Failed to save vote' };
		}
	},
	unvote: async ({ params, locals }) => {
		if (!locals.user || !locals.session) {
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
		}

		try {
			const submissionId = params.id;
			const userId = locals.user.id;

			await db
				.delete(votes)
				.where(and(eq(votes.submissionId, submissionId), eq(votes.userId, userId)));

			return { success: true };
		} catch (error) {
			console.error('Failed to delete vote:', error);
			return { success: false, error: 'Failed to delete vote' };
		}
	},
	react: async ({ params, locals, request }) => {
		if (!locals.user || !locals.session) {
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
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
