import type { PublicUser } from '$lib/types/PublicUser';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user } = locals;
	const publicUser: PublicUser | null = user
		? {
				id: user.id,
				username: user.username,
				email: user.email,
				image: user.image
			}
		: null;
	return { user: publicUser };
}) satisfies LayoutServerLoad;
