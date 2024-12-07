import { insertEventSchema } from '$lib/server/db/schema/event';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
export const load = (async () => {
	const eventForm = await superValidate(zod(insertEventSchema));

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
