import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { createLogger } from '$lib/helpers/logger';
import { sendEmailVerification } from '$lib/server/auth/verifyEmail';
import { resendEmailSchema } from '$lib/schemas/verifyEmail';

const logger = createLogger('verify-email');

export const load = (async ({ locals }) => {
	if (locals.user?.emailVerifiedAt) {
		throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	}

	const form = await superValidate(zod4(resendEmailSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	resend: async ({ request }) => {
		const form = await superValidate(request, zod4(resendEmailSchema));

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

		const { email } = form.data;

		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (!user) {
			logger.warn(`Resend verification attempt for non-existent email: ${email}`);
			return message(form, {
				text: 'If an account with that email exists, a verification email has been sent.',
				status: 'success'
			});
		}

		if (user.emailVerifiedAt) {
			logger.info(`Resend verification attempt for already verified email: ${email}`);
			return message(form, {
				text: 'If an account with that email exists, a verification email has been sent.',
				status: 'success'
			});
		}

		try {
			await sendEmailVerification(email);
			logger.info(`Verification email resent successfully for: ${email}`);
			return message(form, {
				text: 'If an account with that email exists, a verification email has been sent.',
				status: 'success'
			});
		} catch (error) {
			logger.error(`Failed to resend verification email for: ${email}`, {
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
				userId: user.id,
				timestamp: new Date().toISOString()
			});

			// TODO: Consider implementing a retry mechanism or email queue

			return message(form, {
				text: 'If an account with that email exists, a verification email has been sent.',
				status: 'success'
			});
		}
	}
} satisfies Actions;
