import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { createLogger } from '$lib/server/logger';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createLogger('logout');

export const GET: RequestHandler = async (event) => {
	if (!event.locals.session) {
		return fail(401);
	}
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	return redirect(302, '/');
};
