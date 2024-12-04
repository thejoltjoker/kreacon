import { db } from '$lib/server/db';
import { eventCategories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);

	if (!id) {
		const result = await db.query.categories.findMany();

		return { categories: result };
	}

	const result = await db.query.eventCategories.findMany({
		with: {
			category: true
		},
		where: eq(eventCategories.eventId, id)
	});

	return { categories: result.map((item) => item.category) };
}) satisfies PageServerLoad;
