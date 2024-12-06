import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { adminCheck, isAdmin } from '../utils';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const load = (async () => {
	const events = await db.query.events.findMany();

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
