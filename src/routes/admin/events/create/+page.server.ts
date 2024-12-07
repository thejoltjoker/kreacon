import { insertEventSchema } from '$lib/server/db/schema/event';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { CalendarDateTime, parseAbsolute, parseDateTime, parseTime } from '@internationalized/date';
import { z } from 'zod';

const createEventSchema = insertEventSchema.pick({
	description: true,
	name: true,
	slug: true,
	submissionsOpenAt: true,
	submissionsCloseAt: true,
	votingOpenAt: true,
	votingCloseAt: true
});

export const load = (async () => {
	const initialValues = {
		name: '',
		description: '',
		slug: '',
		submissionsOpenAt: new Date(),
		submissionsCloseAt: new Date(),
		votingOpenAt: new Date(),
		votingCloseAt: new Date()
	};
	const eventForm = await superValidate(initialValues, zod(createEventSchema));
	return { eventForm };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(insertEventSchema));
		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

		// Display a success status message
		return message(form, {
			status: 'success',
			message: 'Event created successfully!'
		});
	}
};
