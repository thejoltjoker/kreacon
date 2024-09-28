import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return { token: params.token };
}) satisfies PageServerLoad;

export const actions = {
	resetPassword: async () => {
		// TODO: Implement
		return null;
	}
} satisfies Actions;
