import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	redirect(302, `/users/${params.username}/submissions`);
	return {};
}) satisfies PageLoad;
