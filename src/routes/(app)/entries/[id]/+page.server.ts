import { db } from '$lib/server/db';
import { entries } from '$lib/server/db/schema';

import reactions, { insertReactionSchema } from '$lib/server/db/schema/reaction';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import votes, { insertVoteSchema } from '$lib/server/db/schema/vote';
import { StatusCodes } from 'http-status-codes';
import { isAuthenticated } from '../../utils';
import { createLogger } from '$lib/helpers/logger';
const logger = createLogger('/entries/[id]');
export const load = (async ({ params, locals }) => {
	const { id } = params;
	logger.info(`Loading entry with ID: ${id}`);

	const result = await db.transaction(async (tx) => {
		await tx
			.update(entries)
			.set({ views: sql`${entries.views} + 1` })
			.where(eq(entries.id, id));
		logger.info(`Incremented view count for entry ID: ${id}`);

		return await tx.query.entries.findFirst({
			where: eq(entries.id, id),
			columns: {
				id: true,
				title: true,
				views: true,
				createdAt: true,
				status: true
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
						username: true
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
							with: { avatar: { columns: { url: true } } },
							columns: {
								username: true
							}
						}
					},
					orderBy: (table, { desc }) => [desc(table.updatedAt)]
				},
				votes: locals.user
					? {
							where: eq(votes.userId, locals.user.id)
						}
					: undefined
			}
		});
	});

	if (!result) {
		logger.warn(`Entry with ID: ${id} not found`);
	}

	const isVoted = Boolean(result?.votes && result?.votes.length > 0);
	logger.info(`User ${locals.user?.id} has ${isVoted ? '' : 'not '}voted on entry ID: ${id}`);

	const title = result?.event
		? { text: result.event.name, href: `/entries?event=${result.event.id}` }
		: { text: 'Entries', href: '/entries' };
	return { entry: result, user: locals.user, isVoted, title };
}) satisfies PageServerLoad;

export const actions = {
	vote: async ({ params, locals }) => {
		if (!locals.user || !locals.session) {
			logger.warn(`Unauthorized vote attempt on entry ID: ${params.id}`);
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
		}

		try {
			const entryId = params.id;
			const userId = locals.user.id;
			logger.info(`User ${userId} attempting to vote on entry ID: ${entryId}`);

			const data = insertVoteSchema.parse({
				entryId,
				userId
			});

			await db.insert(votes).values(data).onConflictDoNothing();

			logger.info(`User ${userId} successfully voted on entry ID: ${entryId}`);
			return { success: true };
		} catch (error) {
			logger.error(
				`Failed to insert vote for user ${locals.user.id} on entry ID: ${params.id}`,
				error
			);
			return { success: false, error: 'Failed to save vote' };
		}
	},
	unvote: async ({ params, locals }) => {
		if (!locals.user || !locals.session) {
			logger.warn(`Unauthorized unvote attempt on entry ID: ${params.id}`);
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
		}

		try {
			const entryId = params.id;
			const userId = locals.user.id;
			logger.info(`User ${userId} attempting to unvote on entry ID: ${entryId}`);

			await db.delete(votes).where(and(eq(votes.entryId, entryId), eq(votes.userId, userId)));

			logger.info(`User ${userId} successfully unvoted on entry ID: ${entryId}`);
			return { success: true };
		} catch (error) {
			logger.error(
				`Failed to delete vote for user ${locals.user.id} on entry ID: ${params.id}`,
				error
			);
			return { success: false, error: 'Failed to delete vote' };
		}
	},
	react: async ({ params, locals, request }) => {
		if (!isAuthenticated(locals) || !locals.user) {
			logger.warn(`Unauthorized reaction attempt on entry ID: ${params.id}`);
			return fail(StatusCodes.UNAUTHORIZED, { error: 'Not signed in' });
		}

		try {
			const formData = await request.formData();
			const entryId = params.id;
			const userId = locals.user.id;
			const value = formData.get('reaction')?.toString();
			logger.info(
				`User ${userId} attempting to react on entry ID: ${entryId} with value: ${value}`
			);

			const data = insertReactionSchema.parse({
				entryId,
				userId,
				value
			});

			await db
				.insert(reactions)
				.values(data)
				.onConflictDoUpdate({ target: [reactions.userId, reactions.entryId], set: { value } });

			logger.info(
				`User ${userId} successfully reacted on entry ID: ${entryId} with value: ${value}`
			);
			return { success: true };
		} catch (error) {
			logger.error(
				`Failed to insert reaction for user ${locals.user.id} on entry ID: ${params.id}`,
				error
			);
			return { success: false, error: 'Failed to save reaction' };
		}
	}
};
