import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user } = locals;
	if (!user) {
		console.log('Unauthorized');
	}
	return { user };
}) satisfies PageServerLoad;
