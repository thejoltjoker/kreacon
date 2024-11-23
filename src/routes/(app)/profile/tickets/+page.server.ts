import db from '$lib/server/db';
import tickets from '$lib/server/db/schema/ticket';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { user } = locals;

	if (!user) {
		throw redirect(302, '/login');
	}

	const result = await db.query.tickets.findMany({
		where: eq(tickets.userId, user.id),
		with: {
			event: true
		}
	});

	return { tickets: result };
}) satisfies PageServerLoad;
