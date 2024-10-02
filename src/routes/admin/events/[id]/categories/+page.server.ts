import { db } from '$lib/server/db';
import { categoriesToEvents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const id = Number(params.id);

	if (!id) {
		const result = await db.query.categories.findMany();

		return { categories: result };
	}

	const result = await db.query.categoriesToEvents.findMany({
		with: {
			category: true
		},
		where: eq(categoriesToEvents.eventId, id)
	});

	return { categories: result.map((item) => item.category) };
}) satisfies PageServerLoad;
