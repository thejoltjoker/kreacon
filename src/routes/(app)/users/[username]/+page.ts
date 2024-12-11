import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ params }) => {
	redirect(StatusCodes.TEMPORARY_REDIRECT, `/users/${params.username}/submissions`);
	return {};
}) satisfies PageLoad;
