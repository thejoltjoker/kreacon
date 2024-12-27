import { z } from 'zod';

export const createEventSchema = z
	.object({
		description: z.string().min(1, { message: 'Description is required' }),
		tagline: z.string().min(1, { message: 'Tagline is required' }),
		name: z.string().min(1, { message: 'Name is required' }),
		submissionsOpenAt: z.coerce.date(),
		submissionsCloseAt: z.coerce.date(),
		votingOpenAt: z.coerce.date(),
		votingCloseAt: z.coerce.date(),
		categories: z
			.object({
				categoryId: z.coerce.number(),
				rules: z.object({ text: z.string(), isLocked: z.boolean().default(false) }).array()
			})
			.array(),
		rules: z.object({ text: z.string(), isLocked: z.boolean().default(false) }).array()
	})
	.refine((data) => data.submissionsCloseAt > data.submissionsOpenAt, {
		message: 'Submissions close date must be after submissions open date',
		path: ['submissionsCloseAt']
	})
	.refine((data) => data.votingCloseAt > data.votingOpenAt, {
		message: 'Voting close date must be after voting open date',
		path: ['votingCloseAt']
	});

export type ZCreateEventSchema = typeof createEventSchema;
export type CreateEventSchema = z.infer<typeof createEventSchema>;
