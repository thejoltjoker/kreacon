import { insertUserSchema } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { fromError } from 'zod-validation-error';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	store: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// TODO Validate email and password
		if (!email) {
			return fail(StatusCodes.BAD_REQUEST, { email, emailMissing: true });
		}

		if (!password) {
			return fail(StatusCodes.BAD_REQUEST, { password, missing: true });
		}

		try {
			insertUserSchema.partial({ password: true }).parse({ password });
		} catch (err) {
			const validationError = fromError(err);
			return fail(StatusCodes.BAD_REQUEST, { password: validationError.toString() });
		}
		// TODO Create new user
		// TODO Send email verification
		// TODO Redirect to login
		return { success: true };
	}
};
