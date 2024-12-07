import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { adminCheck, isAdmin } from '../utils';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ url }) => {
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const searchQuery = url.searchParams.get('q');
	let result;

	if (searchQuery) {
		result = await db
			.select()
			.from(events)
			.where(
				sql`to_tsvector('english', ${events.name} || ' ' || ${events.description}) 
					@@ websearch_to_tsquery('english', ${searchQuery})`
			)
			.orderBy(
				desc(
					sql`ts_rank(to_tsvector('english', ${events.name} || ' ' || ${events.description}),
						websearch_to_tsquery('english', ${searchQuery}))`
				),
				sortBy === 'oldest'
					? asc(events.createdAt)
					: sortBy === 'name_asc'
						? asc(events.name)
						: sortBy === 'name_desc'
							? desc(events.name)
							: sortBy === 'random'
								? sql`random()`
								: desc(events.createdAt)
			);
	} else {
		result = await db
			.select()
			.from(events)
			.orderBy(
				sortBy === 'oldest'
					? asc(events.createdAt)
					: sortBy === 'name_asc'
						? asc(events.name)
						: sortBy === 'name_desc'
							? desc(events.name)
							: sortBy === 'random'
								? sql`random()`
								: desc(events.createdAt)
			);
	}

	return { events: result, title: { text: 'Events', href: '/admin/events' } };
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request, locals }) => {
		const schema = z.object({
			eventId: z.coerce.number(),
			sanityCheck: z.literal('heck yeah')
		});

		adminCheck(locals);

		const formData = await request.formData();
		try {
			const { eventId, sanityCheck } = schema.parse(Object.fromEntries(formData.entries()));
			console.log(eventId, sanityCheck);

			await db.delete(events).where(eq(events.id, Number(eventId)));
		} catch (error) {
			console.error(error);
			return fail(StatusCodes.BAD_REQUEST, { message: "Couldn't delete event" });
		}
	}
} satisfies Actions;
