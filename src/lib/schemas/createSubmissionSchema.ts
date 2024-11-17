import { z } from 'zod';

export const createSubmissionSchema = z.object({
	userId: z.string(),
	categoryId: z.number(),
	eventId: z.number(),
	title: z.string().min(1),
	mediaId: z.number()
});