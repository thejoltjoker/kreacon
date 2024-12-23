import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.email({ message: 'Invalid email address' })
		.max(128, { message: 'Email is too long' }),
	password: z.string().max(128, { message: 'Password is too long' }),
	redirect: z.string().optional()
});

export type ZLoginSchema = typeof loginSchema;
export type LoginSchema = z.infer<typeof loginSchema>;
