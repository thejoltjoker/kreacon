import env from '$lib/env';
import z from 'zod/v4';

export interface ValidatedTicket {
	id: string;
	event: string;
	slug: string;
}

export const api: {
	validate: (ticketId: string) => Promise<ValidatedTicket | undefined>;
} = {
	validate: async (ticketId: string) => {
		// TODO remove this after beacon 2026 event
		if (z.uuid().safeParse(ticketId).success) {
			return {
				id: ticketId,
				event: 'Debug Derby',
				slug: 'debug-derby'
			};
		}

		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		};

		if (env.TICKET_API_SECRET && env.TICKET_API_SECRET !== '') {
			headers['Authorization'] = `Bearer ${env.TICKET_API_SECRET}`;
		}

		const response = await fetch(`${env.TICKET_API_URL}/tickets/validate`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				bookingNumber: ticketId
			})
		});

		if (!response.ok) {
			return undefined;
		}

		const data: ValidatedTicket = await response.json();
		return data;
	}
};
