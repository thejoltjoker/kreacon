import db from '$lib/server/db';
import { eventCategories, events } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { PageServerLoad } from './categories/$types';

export const load = (async ({ params }) => {
	const result = await db.transaction(async (tx) => {
		const event = await tx.query.events.findFirst({
			where: eq(events.slug, params.slug),
			columns: {
				id: true
			}
		});

		if (!event) {
			throw error(StatusCodes.NOT_FOUND, 'Event not found');
		}

		const categories = await tx.query.eventCategories.findMany({
			where: eq(eventCategories.eventId, event.id),
			with: {
				category: true,
				rules: true
			}
		});

		return { categories, event };
	});

	const title = { text: 'Events', href: '/events' };
	const { event } = result;
	const categories = result.categories.map((category) => ({
		...category.category,
		rules: category.rules
	}));
	return { categories, event, title };
}) satisfies PageServerLoad;
