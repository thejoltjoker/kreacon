import { login } from '$lib/auth';
import type { Actions, PageServerLoad } from '../login copy/$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		console.log(email, password);
		try {
			const user = await login(email, password);
			// const user = await db.getUser(email);
			// cookies.set('sessionid', await db.createSession(user), { path: '/' });

			return { success: true, user: user };
		} catch (error) {
			return { error: error.message };
		}
	}
};
