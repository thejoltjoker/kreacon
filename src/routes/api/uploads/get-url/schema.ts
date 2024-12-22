import { z } from 'zod';

export const getUrlSchema = z.object({
	checksum: z.string().optional(),
	container: z.string(),
	name: z.string(),
	type: z.string()
});

export type GetUrlSchema = z.infer<typeof getUrlSchema>;
