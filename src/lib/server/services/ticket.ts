import env from '$lib/env';

export interface ValidatedTicket {
	id: string;
	event: string;
}
export const api: {
	validate: (ticketId: string) => Promise<ValidatedTicket | undefined>;
} = {
	validate: async (ticketId: string) => {
		const response = await fetch(`${env.TICKET_API_URL}/${ticketId}`);
		const data: ValidatedTicket = await response.json();
		return data;
	}
};
