import { createSubmissionSchema } from '$lib/schemas/submission';
import db from '$lib/server/db';
import { tickets, users } from '$lib/server/db/schema';
import submissions from '$lib/server/db/schema/submission';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user || !locals.session) {
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/login?redirect=/submissions/create');
	}

	const form = await superValidate(zod(createSubmissionSchema));
	const now = new Date();

	const userData = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		with: {
			tickets: {
				with: {
					event: {
						with: { eventCategories: { with: { category: true, rules: true } }, rules: true }
					}
				}
			},
			submissions: true
		}
	});

	const userTickets =
		userData?.tickets.filter(
			(ticket) =>
				ticket.event &&
				ticket.event.submissionsOpenAt <= now &&
				ticket.event.submissionsCloseAt > now
		) || [];

	const events = userTickets.map((ticket) => {
		const mappedCategories = ticket.event?.eventCategories.map((ce) => ({
			...ce.category,
			rules: ce.rules.map((r) => r.text),
			isDisabled: userData?.submissions.some((s) => {
				const currentEvent = s.eventId === ticket.event?.id;
				const currentCategory = s.categoryId === ce.category.id;
				return currentEvent && currentCategory;
			})
		}));

		return {
			categories: mappedCategories,
			description: ticket.event?.description,
			eventId: ticket.event?.id,
			name: ticket.event?.name,
			submissionsCloseAt: ticket.event?.submissionsCloseAt,
			submissionsOpenAt: ticket.event?.submissionsOpenAt,
			// ticketId: ticket.id,
			votingCloseAt: ticket.event?.votingCloseAt,
			votingOpenAt: ticket.event?.votingOpenAt,
			rules: ticket.event?.rules.map((r) => r.text)
		};
	});

	const title = { text: 'Create Submission' };
	return {
		form,
		events,
		title
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			redirect(StatusCodes.MOVED_TEMPORARILY, '/login?redirect=/submissions/create');
		}
		const { user } = locals;
		const form = await superValidate(request, zod(createSubmissionSchema));

		console.log('Massaging form data');
		console.log('form', form);
		console.log('media', form.data.mediaId);
		if (!form.valid) return fail(StatusCodes.BAD_REQUEST, { form });

		const userData = await db.query.users.findFirst({
			where: eq(users.id, user.id),
			with: {
				tickets: {
					where: eq(tickets.eventId, form.data.eventId),
					with: {
						event: {
							with: { eventCategories: { with: { category: true } } }
						}
					}
				},
				submissions: {
					where: and(
						eq(submissions.userId, user.id),
						eq(submissions.eventId, form.data.eventId),
						eq(submissions.categoryId, form.data.categoryId)
					)
				}
			}
		});

		const [ticket] = userData?.tickets ?? [];
		if (ticket == null) {
			return error(StatusCodes.FORBIDDEN, {
				message: 'User does not have a ticket for this event'
			});
		}

		const alreadySubmitted = userData?.submissions != null && userData?.submissions.length > 0;
		if (alreadySubmitted) {
			return error(StatusCodes.FORBIDDEN, { message: 'User already submitted to this category' });
		}

		const category = ticket.event?.eventCategories.find(
			(ce) => ce.category.id === form.data.categoryId
		)?.category;
		if (category == null) {
			return error(StatusCodes.BAD_REQUEST, { message: 'Category not available for this event' });
		}

		// TODO Get checksum from blob storage

		let id: string | null = null;
		try {
			const [result] = await db
				.insert(submissions)
				.values({
					...form.data,
					userId: user.id,
					ticketId: ticket.id,
					status: 'pending',
					mediaId: form.data.mediaId,
					// TODO Add thumbnail
					thumbnailId: form.data.thumbnailId,
					proofId: form.data.proofId,
					license: form.data.license
				})
				.returning();
			id = result?.id;
		} catch {
			return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to create submission' });
		}
		if (id != null) {
			redirect(StatusCodes.SEE_OTHER, `/submissions/${id}`);
		}

		// TODO Remove permissions from blob store
		return message(form, { text: 'Form posted successfully!', status: 'success' });
	}
} satisfies Actions;
