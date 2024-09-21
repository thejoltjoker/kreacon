import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const user: User = {
		id: '1',
		email: 'test@test.com'
	};
	return { user };
}) satisfies PageServerLoad;
