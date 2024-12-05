import { db } from '$lib/server/db';
import users, { updateUserSchema } from '$lib/server/db/schema/user';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import tickets, { insertTicketSchema } from '$lib/server/db/schema/ticket';
import { ticket as ticketClient } from '$lib/server/services/ticket';

export const load = (async ({ locals }) => {
	if (!locals.user || !locals.session) {
		return redirect(302, '/login');
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		columns: {
			password: false
		},
		with: {
			tickets: {
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

	if (!user) {
		return redirect(302, '/login');
	}
	const form = await superValidate(user, zod(updateUserSchema));

	const tickets = user.tickets.map((t) => ({
		id: t.id,
		event: t.event
	}));

	const ticketForm = await superValidate(zod(insertTicketSchema));
	return { form, ticketForm, user, tickets };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return redirect(302, '/login');
		}

		const form = await superValidate(request, zod(updateUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (await db.query.users.findFirst({ where: eq(users.username, form.data.username ?? '') })) {
			return setError(form, 'username', 'Username unavailable.');
		}

		if (await db.query.users.findFirst({ where: eq(users.email, form.data.email ?? '') })) {
			return setError(form, 'email', 'Email unavailable.');
		}

		await db.update(users).set(form.data).where(eq(users.id, locals.user.id));

		return message(form, 'Form posted successfully!');
	},
	addTicket: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return redirect(302, '/login');
		}

		const ticketForm = await superValidate(request, zod(insertTicketSchema));

		if (!ticketForm.valid) return fail(400, { ticketForm });

		const ticketIsValid = await ticketClient.validate(ticketForm.data.id ?? '');

		if (!ticketIsValid) {
			return setError(ticketForm, 'id', 'Ticket is invalid.');
		}

		// TODO Add ticket
		await db.insert(tickets).values({
			id: ticketForm.data.id,
			userId: locals.user.id,
			eventId: ticketForm.data.eventId
		});

		return message(ticketForm, 'Ticket form submitted');
	}
};
