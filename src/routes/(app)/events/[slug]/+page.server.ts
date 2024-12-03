import db from '$lib/server/db';
import { eventCategories, events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './categories/$types';
export const load = (async ({ params }) => {
	const result = await db.transaction(async (tx) => {
		const { id: eventId } = await tx.query.events.findFirst({
			where: eq(events.slug, params.slug),
			columns: {
				id: true
			}
		});

		const categories = await tx.query.eventCategories.findMany({
			where: eq(eventCategories.eventId, eventId),
			with: {
				category: true,
				eventCategoriesToRules: {
					with: {
						rule: true
					}
				}
			}
		});

		const event = await tx.query.events.findFirst({
			where: eq(events.id, eventId)
		});

		return { categories, event };
	});

	const title = { text: 'Events', href: '/events' };
	const { event } = result;
	const categories = result.categories.map((category) => ({
		...category.category,
		rules: category.eventCategoriesToRules.map((rule) => rule.rule)
	}));
	return { categories, event, title };
}) satisfies PageServerLoad;
