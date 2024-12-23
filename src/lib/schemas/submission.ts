import { z } from 'zod';
import { licenseEnum } from './license';

export const createSubmissionSchema = z.object({
	categoryId: z.coerce.number(),
	eventId: z.coerce.number(),
	title: z.string(),
	mediaId: z.string().uuid(),
	thumbnailId: z.string().uuid(),
	proofId: z.string().uuid().optional(),
	license: licenseEnum
});

export type ZCreateSubmissionSchema = typeof createSubmissionSchema;
export type CreateSubmissionSchema = z.infer<typeof createSubmissionSchema>;
