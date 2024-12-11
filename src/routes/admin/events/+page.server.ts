import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { adminCheck } from '../utils';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ url }) => {
	const sortBy = url.searchParams.get('sortBy') ?? 'newest';
	const searchQuery = url.searchParams.get('q');
	let result;
	const sortOptions = {
		oldest: asc(events.createdAt),
		name_asc: asc(events.name),
		name_desc: desc(events.name),
		random: sql`random()`,
		newest: desc(events.createdAt)
	} as const;
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
				sortOptions[sortBy as keyof typeof sortOptions] ?? sortOptions.newest
			);
	} else {
		result = await db
			.select()
			.from(events)
			.orderBy(sortOptions[sortBy as keyof typeof sortOptions] ?? sortOptions.newest);
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
			const { eventId } = schema.parse(Object.fromEntries(formData.entries()));

			await db.delete(events).where(eq(events.id, Number(eventId)));
		} catch (error) {
			console.error(error);
			return fail(StatusCodes.BAD_REQUEST, { message: "Couldn't delete event" });
		}
	}
} satisfies Actions;
