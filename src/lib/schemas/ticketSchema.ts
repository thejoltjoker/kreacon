import { z } from 'zod';

export const ticketSchema = z.object({
	id: z.string()
});
