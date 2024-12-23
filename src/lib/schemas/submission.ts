import { z } from 'zod';
import { licenseEnum } from './license';

export const createSubmissionSchema = z.object({
	categoryId: z.coerce.number().min(1, { message: 'Missing category ID' }),
	eventId: z.coerce.number().min(1, { message: 'Missing event ID' }),
	title: z.string().min(1, { message: 'Title is required' }),
	mediaId: z.string().uuid(),
	thumbnailId: z.string().uuid(),
	proofId: z.string().uuid().optional(),
	license: licenseEnum
});

export type ZCreateSubmissionSchema = typeof createSubmissionSchema;
export type CreateSubmissionSchema = z.infer<typeof createSubmissionSchema>;
