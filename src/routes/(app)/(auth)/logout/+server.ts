import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.session) {
		return error(401);
	}
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	return redirect(302, '/');
};
