import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

export const load = (async (event) => {
	if (!event.locals.session) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	}
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	return redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
}) satisfies PageServerLoad;
