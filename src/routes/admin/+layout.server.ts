import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

export const load = (async ({ locals }) => {
	if (locals.session == null || locals.user == null || locals.user.role !== 'admin') {
		throw redirect(302, '/');
	}
	return { title: { text: 'Admin', href: '/admin' } };
}) satisfies LayoutServerLoad;
