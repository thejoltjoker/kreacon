import type { Thumbnail } from '@bitmovin/api-sdk';
import { z } from 'zod';

export const createSubmissionSchema = z.object({
	categoryId: z.coerce.number(),
	eventId: z.coerce.number(),
	title: z.string(),
	media: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 1_000_000_000, 'Max 1 GB upload size.'),
	thumbnail: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 2_000_000, 'Max 2 MB upload size.')
});

export type ZCreateSubmissionSchema = typeof createSubmissionSchema;
export type CreateSubmissionSchema = z.infer<typeof createSubmissionSchema>;
