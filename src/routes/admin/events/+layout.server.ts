import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	return { title: { text: 'Events', href: '/admin/events' } };
}) satisfies LayoutServerLoad;
