import { z } from 'zod/v4';
import { licenseEnum } from './license';

export const createEntrySchema = z.object({
	categoryId: z.coerce.number().min(1, { message: 'Missing category ID' }),
	eventId: z.coerce.number().min(1, { message: 'Missing event ID' }),
	title: z.string().min(1, { message: 'Title is required' }),
	description: z
		.string()
		.trim()
		.min(1, { message: 'Description cannot be empty' })
		.max(1024)
		.optional()
		.or(z.literal(''))
		.transform((val) => (val === '' ? undefined : val)),
	mediaId: z.uuid(),
	thumbnailId: z.uuid().optional(),
	previewId: z.uuid(),
	proofId: z.uuid().optional(),
	license: licenseEnum
});

export type ZCreateEntrySchema = typeof createEntrySchema;
export type CreateEntrySchema = z.infer<typeof createEntrySchema>;
