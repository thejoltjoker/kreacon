import { db } from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import tickets, { insertTicketSchema } from '$lib/server/db/schema/ticket';
import { api as ticketClient } from '$lib/server/services/ticket';
import { events } from '$lib/server/db/schema';
import type { SuperFormMessage } from '$lib/types/SuperFormMessage';
import { StatusCodes } from 'http-status-codes';
import { authCheck, isEmailVerified } from '../utils';
import { updateUserSchema } from '$lib/schemas/user';
import { z } from 'zod/v4';
import type { SelectEvent } from '$lib/server/db/schema/event';

const ticketSchema = z.object({ id: z.string().min(1).max(255) });

export const load = (async ({ locals }) => {
	authCheck(locals, '/login');

	if (!locals.user) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	const userData = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		with: {
			avatar: { columns: { url: true } },
			accounts: { columns: { provider: true, providerAccountId: true } },
			tickets: {
				columns: { id: true },
				with: {
					event: {
						columns: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	});

	if (!userData) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	const userForm = await superValidate(
		{
			username: userData.username,
			email: userData.email,
			avatarId: userData.avatarId
		},
		zod4(updateUserSchema)
	);

	const tickets = userData.tickets.map((t) => ({
		id: t.id,
		event: t.event
	}));

	const ticketForm = await superValidate<Infer<typeof ticketSchema>, SuperFormMessage>(
		zod4(ticketSchema)
	);

	return {
		ticketForm,
		accounts: userData.accounts,
		tickets,
		userForm,
		user: {
			emailVerifiedAt: userData.emailVerifiedAt,
			avatar: userData.avatar,
			username: userData.username,
			role: userData.role
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	updateUser: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
		}

		// TODO Have a second think about whether to require email verification for this action
		// if (!isEmailVerified(locals)) {
		// 	const form = await superValidate(request, zod4(updateUserSchema));
		// 	return fail(StatusCodes.FORBIDDEN, {
		// 		form,
		// 		error: 'Email verification required'
		// 	});
		// }

		const form = await superValidate(request, zod4(updateUserSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUsername = await db.query.users.findFirst({
			where: eq(users.username, form.data.username ?? '')
		});

		if (existingUsername && existingUsername.id !== locals.user.id) {
			return setError(form, 'username', 'Username unavailable.');
		}

		// TODO Allow user to update email
		// if (await db.query.users.findFirst({ where: eq(users.email, form.data.email ?? '') })) {
		// 	return setError(form, 'email', 'Email unavailable.');
		// }

		try {
			await db.update(users).set(form.data).where(eq(users.id, locals.user.id));
			return message(form, { status: 'success', text: 'Profile updated successfully!' });
		} catch (error) {
			console.error('Error updating user', error);
			return message(form, { status: 'error', text: 'Error updating user.' });
		}
	},

	addTicket: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
		}

		if (!isEmailVerified(locals)) {
			const ticketForm = await superValidate<Infer<typeof ticketSchema>, SuperFormMessage>(
				request,
				zod4(ticketSchema)
			);
			return fail(StatusCodes.FORBIDDEN, {
				ticketForm,
				error: 'Email verification required'
			});
		}

		const ticketForm = await superValidate<Infer<typeof ticketSchema>, SuperFormMessage>(
			request,
			zod4(ticketSchema)
		);

		if (!ticketForm.valid) return fail(400, { ticketForm });

		const validatedTicket = await ticketClient.validate(ticketForm.data.id ?? '');

		if (!validatedTicket) {
			return setError(ticketForm, 'id', 'Ticket is invalid.');
		}

		if (!validatedTicket.slug && !validatedTicket.event) {
			return setError(ticketForm, 'id', 'Ticket is invalid.');
		}

		let event: SelectEvent | undefined;

		if (validatedTicket.slug) {
			event = await db.query.events.findFirst({
				where: eq(events.slug, validatedTicket.slug)
			});
		}

		if (!event && validatedTicket.event) {
			event = await db.query.events.findFirst({
				where: eq(events.name, validatedTicket.event)
			});
		}

		if (!event) {
			return setError(ticketForm, 'id', 'Ticket is invalid.');
		}

		try {
			await db.insert(tickets).values({
				id: validatedTicket.id,
				userId: locals.user.id,
				eventId: event.id
			});
		} catch (error) {
			console.error('Error adding ticket', error);
			return setError(ticketForm, 'id', "You've already added a ticket for this event.");
		}

		return message(ticketForm, { status: 'success', text: 'Ticket added successfully!' });
	}
};
