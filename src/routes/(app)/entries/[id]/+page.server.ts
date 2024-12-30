import { db } from '$lib/server/db';
import { entries } from '$lib/server/db/schema';

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
			.update(entries)
			.set({ views: sql`${entries.views} + 1` })
			.where(eq(entries.id, id));

		return await tx.query.entries.findFirst({
			where: eq(entries.id, id),
			columns: {
				id: true,
				title: true,
				views: true,
				createdAt: true
			},
			with: {
				media: {
					columns: {
						url: true,
						type: true,
						name: true
					}
				},
				category: {
					columns: {
						id: true,
						name: true
					}
				},
				event: {
					columns: {
						name: true,
						id: true
					}
				},
				preview: {
					columns: {
						url: true
					}
				},
				user: {
					columns: {
						username: true,
						picture: true
					},
					with: {
						avatar: { columns: { url: true } }
					}
				},
				reactions: {
					columns: {
						userId: true,
						value: true,
						createdAt: true
					},
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

	const title = result?.event
		? { text: result.event.name, href: `/entries?event=${result.event.id}` }
		: { text: 'Entries', href: '/entries' };
	return { entry: result, user: locals.user, isVoted, title };
}) satisfies PageServerLoad;

export const actions = {
	vote: async ({ params, locals }) => {
		if (!locals.user || !locals.session) {
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
		}

		try {
			const entryId = params.id;
			const userId = locals.user.id;

			const data = insertVoteSchema.parse({
				entryId,
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
			const entryId = params.id;
			const userId = locals.user.id;

			await db.delete(votes).where(and(eq(votes.entryId, entryId), eq(votes.userId, userId)));

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
			const entryId = params.id;
			const userId = locals.user.id;
			const value = formData.get('reaction')?.toString();
			const data = insertReactionSchema.parse({
				entryId,
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
