import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	if (!event.locals.session) {
		return redirect(302, '/');
	}
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	return redirect(302, '/');
}) satisfies PageServerLoad;
