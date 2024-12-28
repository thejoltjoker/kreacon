import { z } from 'zod';
import { licenseEnum } from './license';

export const createEntrySchema = z.object({
	categoryId: z.coerce.number().min(1, { message: 'Missing category ID' }),
	eventId: z.coerce.number().min(1, { message: 'Missing event ID' }),
	title: z.string().min(1, { message: 'Title is required' }),
	mediaId: z.string().uuid(),
	thumbnailId: z.string().uuid(),
	proofId: z.string().uuid().optional(),
	license: licenseEnum
});

export type ZCreateEntrySchema = typeof createEntrySchema;
export type CreateEntrySchema = z.infer<typeof createEntrySchema>;
