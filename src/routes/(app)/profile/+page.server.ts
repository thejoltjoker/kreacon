import type { PageServerLoad } from './$types';

export const load = (async () => {
	// TODO Get user from database
	const user = {
		id: '1',
		email: 'test@test.com'
	};
	return { user };
}) satisfies PageServerLoad;
