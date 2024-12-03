import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const { user } = locals;
	const path = url.pathname;
	const title = path === '/' ? 'Kreacon' : path.split('/').pop()?.replace(/-/g, ' ') || 'Not Found';

	return { user, title };
}) satisfies LayoutServerLoad;
