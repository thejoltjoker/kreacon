import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/submissions');
	}
	return {};
}) satisfies PageServerLoad;
