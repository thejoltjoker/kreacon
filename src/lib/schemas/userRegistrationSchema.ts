import { z } from 'zod';
import { passwordSchema } from './passwordSchema';

export const userRegistrationSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: passwordSchema,
		confirmPassword: passwordSchema
	})
	.superRefine(({ password, confirmPassword }, context) => {
		if (confirmPassword !== password) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['password']
			});
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});
