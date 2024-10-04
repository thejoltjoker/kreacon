import { authenticate } from '$lib/server/auth/authenticate';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { redirect, type Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	// i18n
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}

	// auth
	const accessToken = await authenticate(event);
	if (accessToken) {
		event.locals.user = await db.query.users.findFirst({
			where: eq(users.id, accessToken.userId),
			columns: {
				password: false
			}
		});
	}

	// RBAC
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			return redirect(302, '/login');
		}

		if (event.locals.user?.role !== 'admin') {
			return new Response('Unauthorized', { status: 401 });
		}
	}

	const response = await resolve(event);

	return response;
};
