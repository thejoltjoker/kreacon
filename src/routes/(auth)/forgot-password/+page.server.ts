import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	sendResetLink: async () => {
		// TODO: Implement
		return null;
	}
} satisfies Actions;
