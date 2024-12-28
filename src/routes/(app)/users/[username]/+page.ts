import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ params }) => {
	return redirect(StatusCodes.TEMPORARY_REDIRECT, `/users/${params.username}/entries`);
}) satisfies PageLoad;
