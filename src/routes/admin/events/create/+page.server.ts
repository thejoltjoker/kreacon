import { insertEventSchema } from '$lib/server/db/schema/event';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { CalendarDateTime, parseAbsolute, parseDateTime, parseTime } from '@internationalized/date';
import { z } from 'zod';

const createEventSchema = insertEventSchema
	.pick({
		description: true,
		name: true,
		slug: true,
		submissionsOpenAt: true,
		submissionsCloseAt: true,
		votingOpenAt: true,
		votingCloseAt: true
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
		slug: '',
		submissionsOpenAt: new Date(),
		submissionsCloseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		votingOpenAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		votingCloseAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
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
