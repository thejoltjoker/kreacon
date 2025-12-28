import { z } from 'zod/v4';
import { registerUserSchema } from './user';

export const resendEmailSchema = z.object({
	email: registerUserSchema.shape.email
});
