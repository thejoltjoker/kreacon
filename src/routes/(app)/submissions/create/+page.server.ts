import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import submissions, { insertSubmissionSchema } from '$lib/server/db/schema/submission';
import { error, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import { tickets, events, users } from '$lib/server/db/schema';
import { eq, and, lte, gt } from 'drizzle-orm';
import { z } from 'zod';

const createSubmissionSchema = insertSubmissionSchema.extend({
	media: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 1_000_000_000, 'Max 1 GB upload size.')
		.optional(),
	thumbnail: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 2_000_000, 'Max 2 MB upload size.')
		.optional()
});

export const load = (async ({ locals }) => {
	if (!locals.user || !locals.session) {
		redirect(302, '/login?redirect=/submissions/create');
	}
	const form = await superValidate(zod(createSubmissionSchema));
	const now = new Date();

	const userData = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		with: {
			tickets: {
				with: {
					event: { with: { categoriesToEvents: { with: { category: true } } } }
				}
			}
		}
	});

	const userTickets =
		userData?.tickets.filter(
			(ticket) =>
				ticket.event &&
				ticket.event.submissionsOpenAt <= now &&
				ticket.event.submissionsCloseAt > now
		) || [];
	const events = userTickets.map((ticket) => ({
		eventId: ticket.event?.id,
		name: ticket.event?.name,
		description: ticket.event?.description,
		submissionsOpenAt: ticket.event?.submissionsOpenAt,
		submissionsCloseAt: ticket.event?.submissionsCloseAt,
		votingOpenAt: ticket.event?.votingOpenAt,
		votingCloseAt: ticket.event?.votingCloseAt,
		categories: ticket.event?.categoriesToEvents.map((ce) => ce.category)
	}));

	const media = await db.query.media.findFirst();

	form.data = {
		title: 'My title',
		userId: locals.user.id,
		categoryId: events?.[0]?.categories?.[0]?.id ?? 0,
		eventId: events?.[0]?.eventId ?? 0,
		mediaId: media?.id ?? 0,
		status: 'draft',
		thumbnailId: media?.id ?? 0,
		ticketId: userTickets?.[0]?.id ?? 0
	};
	return {
		form,
		events
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createSubmissionSchema));

		console.log('Massaging form data');
		console.log('form', form);
		console.log('form errors:', form.errors);

		// TODO Add user id from locals

		if (!form.valid) return fail(400, { form });

		// TODO Verify that user can submit to event and category
		try {
			await db.insert(submissions).values(form.data);
		} catch {
			return error(500, { message: 'Failed to create submission' });
		}

		return message(form, { text: 'Form posted successfully!' });
	}
} satisfies Actions;
