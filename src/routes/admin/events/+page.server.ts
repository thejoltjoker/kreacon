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

	const events = await db.query.events.findMany({
		orderBy: (items) => {
			switch (sortBy) {
				case 'oldest':
					return asc(items.createdAt);
				case 'newest':
					return desc(items.createdAt);
				case 'name_asc':
					return asc(items.name);
				case 'name_desc':
					return desc(items.name);
				case 'random':
					return sql`random()`;
				default:
					return desc(items.createdAt);
			}
		}
	});

	return { events, title: { text: 'Events', href: '/admin/events' } };
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
