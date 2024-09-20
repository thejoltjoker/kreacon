import { register } from '$lib/auth';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		if (!email || !password) {
			throw new Error('Email and password are required');
		}
		try {
			const user = await register(email.toString(), password.toString());
			// const user = await db.getUser(email);
			// cookies.set('sessionid', await db.createSession(user), { path: '/' });

			return { success: true, user: user };
		} catch (error) {
			return { error: error };
		}
	}
};
