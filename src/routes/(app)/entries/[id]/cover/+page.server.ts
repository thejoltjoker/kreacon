import { isBetweenDates } from '$lib/helpers/isBetweenDates';
import { db } from '$lib/server/db';
import { entries } from '$lib/server/db/schema';
import votes from '$lib/server/db/schema/vote';
import { createBackendLogger } from '$lib/server/logger';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
const logger = createBackendLogger('/entries/[id]');
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
				status: true,
				license: true,
				description: true
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
						id: true,
						votingOpenAt: true,
						votingCloseAt: true
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
				}
			}
		});
	});

	if (!result) {
		logger.warn(`Entry with ID: ${id} not found`);
	}

	const isVoted = Boolean(result?.votes && result?.votes.length > 0);
	const isOpenForVoting =
		result && isBetweenDates(new Date(), result.event.votingOpenAt, result.event.votingCloseAt);

	const title = result?.event
		? { text: result.event.name, href: `/entries?event=${result.event.id}` }
		: { text: 'Entries', href: '/entries' };
	return { entry: result, user: locals.user, isVoted, title, isOpenForVoting };
}) satisfies PageServerLoad;
