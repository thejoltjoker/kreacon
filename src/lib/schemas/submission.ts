import { z } from 'zod';

export const createSubmissionSchema = z.object({
	categoryId: z.coerce.number(),
	eventId: z.coerce.number(),
	title: z.string(),
	media: z.string().uuid(),
	thumbnail: z.string().uuid(),
	proof: z.string().uuid().optional()
});

export type ZCreateSubmissionSchema = typeof createSubmissionSchema;
export type CreateSubmissionSchema = z.infer<typeof createSubmissionSchema>;
