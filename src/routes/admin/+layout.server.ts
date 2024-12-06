import { error } from '@sveltejs/kit';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import type { LayoutServerLoad } from './$types';
import { adminCheck, isAdmin } from './utils';

export const load = (async ({ locals }) => {
	adminCheck(locals);
	return { title: { text: 'Admin', href: '/admin' } };
}) satisfies LayoutServerLoad;
