import env from '$lib/env';

export const ticket: {
	validate: (ticketId: string) => Promise<boolean>;
} = {
	validate: async (ticketId: string) => {
		const response = await fetch(`${env.TICKET_API_URL}/${ticketId}`);
		const data = await response.json();
		return data.result;
	}
};
