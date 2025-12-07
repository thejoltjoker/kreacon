import { z } from 'zod/v4';
import { hasSpecialCharacter, isCommonPassword } from '../validation/password/passwordValidation';

export const passwordSchema = z
	.string()
	.min(8, {
		message: `Password must be at least ${8} characters long`
	})
	.max(128, { message: 'Password must be at most 128 characters long' })
	.refine((password) => /[A-Z]/.test(password), {
		message: 'Password must contain at least one uppercase letter'
	})
	.refine((password) => /[a-z]/.test(password), {
		message: 'Password must contain at least one lowercase letter'
	})
	.refine((password) => /[0-9]/.test(password), {
		message: 'Password must contain at least one number'
	})
	.refine((password) => hasSpecialCharacter(password), {
		message: 'Password must contain at least one special character'
	})
	.refine(async (password) => !(await isCommonPassword(password, '10000')), {
		message: 'Password is too common'
	});
