import { z } from 'zod/v4';

export const ticketSchema = z.object({
	id: z.string()
});
