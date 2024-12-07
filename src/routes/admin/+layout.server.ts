import type { LayoutServerLoad } from './$types';
import { adminCheck } from './utils';

export const load = (async ({ locals }) => {
	adminCheck(locals);
	return { title: { text: 'Admin', href: '/admin' } };
}) satisfies LayoutServerLoad;
