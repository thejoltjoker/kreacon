import { z } from 'zod';
import { passwordSchema } from './passwordSchema';

export const userRegistrationSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: passwordSchema
});

export const userUpdateSchema = z.object({
	id: z.string().uuid({ message: 'Invalid UUID format' }),
	username: z
		.string()
		.min(3, { message: 'Username must be at least 3 characters' })
		.refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
			message: 'Username can only contain letters, numbers, and underscores'
		})
		.nullable(),
	email: z.string().email({ message: 'Invalid email address' }).nullable(),
	image: z.string().url({ message: 'Invalid image URL' }).nullable(),
	password: passwordSchema.nullable().optional()
});
