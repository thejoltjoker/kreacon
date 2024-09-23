import { PASSWORD_MIN_LENGTH } from '../config';
import { hasSpecialCharacter, isCommonPassword } from '../validation/password/passwordValidation';
import { z } from 'zod';

export const passwordSchema = z
	.string()
	.min(PASSWORD_MIN_LENGTH, {
		message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
	})
	.max(64, { message: 'Password must be at most 64 characters long' })
	// .refine((password) => /[A-Z]/.test(password), {
	// 	message: 'Password must contain at least one uppercase letter',
	// 	params: {
	// 		code: 'uppercase'
	// 	}
	// })
	.refine((password) => /[a-z]/.test(password), {
		message: 'Password must contain at least one lowercase letter',
		params: {
			code: 'lowercase'
		}
	})
	.refine((password) => /[0-9]/.test(password), {
		message: 'Password must contain at least one number',
		params: {
			code: 'number'
		}
	})
	.refine((password) => hasSpecialCharacter(password), {
		message: 'Password must contain at least one special character',
		params: {
			code: 'special'
		}
	})
	.refine(async (password) => !(await isCommonPassword(password, '10000')), {
		message: 'Password is too common',
		params: {
			code: 'common'
		}
	});
