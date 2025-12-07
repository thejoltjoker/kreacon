import { isValidMediaType } from '$lib/helpers/mediaTypes';
import { z } from 'zod/v4';

export const createCategorySchema = z.object({
	mediaType: z.string().refine((value) => isValidMediaType(value), {
		message: 'Invalid media type'
	}),
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(255, { message: 'Name is too long' }),
	description: z.string().min(1, { message: 'Description is required' }),
	slug: z
		.string()
		.min(1, { message: 'Slug is required' })
		.max(300, { message: 'Slug is too long' })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message: 'Slug must be in kebab-case format (lowercase letters, numbers, and hyphens only)'
		})
		.optional()
});
