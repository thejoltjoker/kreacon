import { createEntrySchema } from '$lib/schemas/entry';
import db from '$lib/server/db';
import { tickets, users } from '$lib/server/db/schema';
import entries from '$lib/server/db/schema/entry';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { createLogger } from '$lib/helpers/logger';
import { isAuthenticated, isEmailVerified } from '../../utils';

const logger = createLogger('entries/create');

export const load = (async ({ locals }) => {
	if (!isAuthenticated(locals) || locals.user == null) {
		logger.warn('Unauthorized access attempt to entry creation page');
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/login?redirect=/entries/create');
	}

	if (!isEmailVerified(locals)) {
		logger.warn(`Unverified user ${locals.user.id} attempted to access entry creation page`);
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/verify-email');
	}

	logger.info('Loading entry creation page', { userId: locals.user.id });

	const form = await superValidate(zod4(createEntrySchema));
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
			entries: true
		}
	});

	if (!userData) {
		logger.error('User data not found for authenticated user', { userId: locals.user.id });
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/login?redirect=/entries/create');
	}

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
			isDisabled: userData?.entries.some((s) => {
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

	const title = { text: 'Submit entry' };
	return {
		form,
		events,
		title
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			logger.warn('Unauthorized submission attempt', {
				ip: request.headers.get('x-forwarded-for') || 'unknown'
			});
			redirect(StatusCodes.MOVED_TEMPORARILY, '/login?redirect=/entries/create');
		}

		if (!isEmailVerified(locals)) {
			logger.warn(`Unverified user ${locals.user.id} attempted to submit entry`);
			return fail(StatusCodes.FORBIDDEN, { error: 'Email verification required' });
		}

		logger.info('Processing entry submission', { userId: locals.user.id });
		const { user } = locals;
		const form = await superValidate(request, zod4(createEntrySchema));

		if (!form.valid) {
			logger.warn('Invalid form submission', {
				userId: locals.user.id,
				errors: form.errors
			});
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

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
				entries: {
					where: and(
						eq(entries.userId, user.id),
						eq(entries.eventId, form.data.eventId),
						eq(entries.categoryId, form.data.categoryId)
					)
				}
			}
		});

		const [ticket] = userData?.tickets ?? [];
		if (ticket == null) {
			logger.warn('Submission attempt without valid ticket', {
				userId: locals.user.id,
				eventId: form.data.eventId
			});
			return error(StatusCodes.FORBIDDEN, {
				message: 'User does not have a ticket for this event'
			});
		}

		const alreadySubmitted = userData?.entries != null && userData?.entries.length > 0;
		if (alreadySubmitted) {
			logger.warn('Duplicate submission attempt', {
				userId: locals.user.id,
				eventId: form.data.eventId,
				categoryId: form.data.categoryId
			});
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
				.insert(entries)
				.values({
					...form.data,
					userId: user.id,
					ticketId: ticket.id,
					status: 'pending',
					mediaId: form.data.mediaId,
					thumbnailId: form.data.thumbnailId,
					previewId: form.data.previewId,
					proofId: form.data.proofId,
					license: form.data.license
				})
				.returning();
			id = result?.id;
			logger.info('Entry created successfully', {
				userId: locals.user.id,
				entryId: id,
				eventId: form.data.eventId,
				categoryId: form.data.categoryId
			});
		} catch (err) {
			logger.error('Failed to create entry', {
				userId: locals.user.id,
				error: err,
				formData: form.data
			});
			return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to create entry' });
		}
		if (id != null) {
			redirect(StatusCodes.SEE_OTHER, `/entries/${id}`);
		}

		// TODO Remove permissions from blob store
		return message(form, { text: 'Form posted successfully!', status: 'success' });
	}
} satisfies Actions;
