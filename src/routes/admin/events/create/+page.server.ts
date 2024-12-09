import db from '$lib/server/db';
import events, { insertEventSchema } from '$lib/server/db/schema/event';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import kebabCase from 'lodash/kebabCase';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const createEventSchema = insertEventSchema
	.pick({
		description: true,
		name: true,
		submissionsOpenAt: true,
		submissionsCloseAt: true,
		votingOpenAt: true,
		votingCloseAt: true
	})
	.extend({
		categories: z
			.object({
				categoryId: z.number(),
				rules: z.object({ value: z.string(), isLocked: z.boolean().default(false) }).array()
			})
			.array()
	})
	.refine((data) => data.submissionsCloseAt > data.submissionsOpenAt, {
		message: 'Submissions close date must be after submissions open date',
		path: ['submissionsCloseAt']
	})
	.refine((data) => data.votingCloseAt > data.votingOpenAt, {
		message: 'Voting close date must be after voting open date',
		path: ['votingCloseAt']
	});

export const load = (async () => {
	const initialValues = {
		name: '',
		description: '',
		submissionsOpenAt: new Date(),
		submissionsCloseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		votingOpenAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		votingCloseAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
		categories: [{ categoryId: 1, rules: [{ value: 'Test rule', isLocked: false }] }]
	};
	const eventForm = await superValidate(initialValues, zod(createEventSchema));
	const categories = await db.query.categories.findMany({
		columns: {
			id: true,
			name: true
		}
	});
	return { eventForm, categories };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(insertEventSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		let slug = kebabCase(form.data.name);
		const existingEvent = await db.query.events.findFirst({
			where: eq(events.slug, slug)
		});

		if (existingEvent) {
			slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
		}

		const [result] = await db
			.insert(events)
			.values({ ...form.data, slug })
			.returning();

		// Display a success status message
		// return message(form, {
		// 	status: 'success',
		// 	message: `Event created successfully! #${result?.id}`
		// });
		redirect(StatusCodes.TEMPORARY_REDIRECT, `/admin/events`);
	}
};
