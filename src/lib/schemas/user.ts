import { z } from 'zod';
import { passwordSchema } from './passwordSchema';

export const registerUserSchema = z.object({
	username: z
		.string()
		.min(1, { message: 'Username is required' })
		.max(255, { message: 'Username is too long' })
		.refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
			message: 'Username can only contain letters, numbers, and underscores'
		}),
	email: z
		.string()
		.email({ message: 'Invalid email address' })
		.max(255, { message: 'Email is too long' }),
	password: passwordSchema
});

export type ZRegisterUserSchema = typeof registerUserSchema;
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const updateUserSchema = registerUserSchema
	.merge(
		z.object({
			picture: z.string().optional()
		})
	)
	.partial();
