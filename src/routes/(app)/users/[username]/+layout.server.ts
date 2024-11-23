import db from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { desc, eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import submissions from '$lib/server/db/schema/submission';

export const load = (async ({ params }) => {
	const user = await db.query.users.findFirst({
		where: eq(users.username, params.username),
		with: {
			submissions: {
				orderBy: desc(submissions.createdAt),
				with: {
					media: true
				}
			},
			tickets: {
				with: {
					event: true
				},
				columns: {
					eventId: true
				}
			},

			votes: {
				with: {
					submission: true
				}
			},
			reactions: {
				with: {
					submission: true
				}
			}
		},
		columns: {
			password: false
		}
	});

	return { user };
}) satisfies LayoutServerLoad;
