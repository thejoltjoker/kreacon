import db from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { desc, eq, and } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import submissions from '$lib/server/db/schema/submission';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const result = await db.transaction(async (tx) => {
		const user = await tx.query.users.findFirst({
			where: eq(users.username, params.username),
			columns: {
				username: true,
				picture: true,
				id: true,
				createdAt: true
			},
			with: {
				submissions: {
					columns: {
						id: true
					}
				},
				tickets: {
					columns: {
						eventId: true
					}
				}
			}
		});

		if (!user) {
			throw error(StatusCodes.NOT_FOUND, 'User not found');
		}

		const submissionsResult = await tx.query.submissions.findMany({
			where: and(
				eq(submissions.userId, user.id),
				locals.user?.id !== user.id ? eq(submissions.status, 'published') : undefined
			),
			orderBy: desc(submissions.createdAt),
			with: {
				media: true
			}
		});

		return {
			profileUser: {
				username: user.username,
				picture: user.picture,
				submissionCount: user.submissions.length,
				ticketCount: user.tickets.length,
				createdAt: user.createdAt
			},
			submissions: submissionsResult,
			title: { text: 'User', href: `/users/${user.username}` }
		};
	});

	return result;
}) satisfies LayoutServerLoad;
