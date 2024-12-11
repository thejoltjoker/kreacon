import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	return redirect(StatusCodes.TEMPORARY_REDIRECT, '/admin/events');
}) satisfies PageLoad;
