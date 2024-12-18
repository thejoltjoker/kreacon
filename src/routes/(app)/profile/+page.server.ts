import { db } from '$lib/server/db';
import users from '$lib/server/db/schema/user';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { message, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import tickets, { insertTicketSchema } from '$lib/server/db/schema/ticket';
import { api as ticketClient } from '$lib/server/services/ticket';
import { events } from '$lib/server/db/schema';
import type { SuperFormMessage } from '$lib/types/SuperFormMessage';
import { StatusCodes } from 'http-status-codes';
import { authCheck } from '../utils';
import { updateUserSchema } from '$lib/schemas/user';

const ticketSchema = insertTicketSchema.pick({ id: true });

export const load = (async ({ locals }) => {
	authCheck(locals, '/login');

	if (!locals.user) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	const userData = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		with: {
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
		{ username: userData.username, email: userData.email },
		zod(updateUserSchema)
	);

	const tickets = userData.tickets.map((t) => ({
		id: t.id,
		event: t.event
	}));

	const ticketForm = await superValidate<Infer<typeof ticketSchema>, SuperFormMessage>(
		zod(ticketSchema)
	);

	return { ticketForm, accounts: userData.accounts, tickets, userForm };
}) satisfies PageServerLoad;

export const actions = {
	updateUser: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
		}

		const form = await superValidate(request, zod(updateUserSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUsername = await db.query.users.findFirst({
			where: eq(users.username, form.data.username ?? '')
		});

		if (existingUsername && existingUsername.id !== locals.user.id) {
			return setError(form, 'username', 'Username unavailable.');
		}

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

		const ticketForm = await superValidate<Infer<typeof ticketSchema>, SuperFormMessage>(
			request,
			zod(ticketSchema)
		);

		if (!ticketForm.valid) return fail(400, { ticketForm });

		const validatedTicket = await ticketClient.validate(ticketForm.data.id ?? '');

		if (!validatedTicket) {
			return setError(ticketForm, 'id', 'Ticket is invalid.');
		}

		const event = await db.query.events.findFirst({
			where: eq(events.name, validatedTicket.event)
		});

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
