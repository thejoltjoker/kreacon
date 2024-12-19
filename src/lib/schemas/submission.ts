import type { Thumbnail } from '@bitmovin/api-sdk';
import { z } from 'zod';

export const createSubmissionSchema = z.object({
	categoryId: z.number(),
	eventId: z.number(),
	title: z.string(),
	media: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 1_000_000_000, 'Max 1 GB upload size.')
		.optional(),
	thumbnail: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 2_000_000, 'Max 2 MB upload size.')
		.optional()
});

export type ZCreateSubmissionSchema = typeof createSubmissionSchema;
export type CreateSubmissionSchema = z.infer<typeof createSubmissionSchema>;
