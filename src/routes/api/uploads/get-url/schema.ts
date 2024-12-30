import { azureStorageContainer } from '$lib/types/AzureStorageContainer';
import { z } from 'zod';
import mime from 'mime';

export const getUrlSchema = z.object({
	uuid: z.string().uuid(),
	checksum: z.string().optional(),
	container: z.enum(azureStorageContainer, {
		message: 'Invalid container name'
	}),
	name: z.string().min(1, {
		message: 'Name is required'
	}),
	type: z.string().refine((val) => mime.getExtension(val) != null, {
		message: 'Invalid MIME type'
	}),
	size: z.number().default(0)
});

export type GetUrlSchema = z.infer<typeof getUrlSchema>;
