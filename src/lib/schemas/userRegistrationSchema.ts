import { z } from 'zod';
import { passwordSchema } from './passwordSchema';

export const userRegistrationSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: passwordSchema
});
