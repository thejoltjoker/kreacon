import { authenticate } from '$lib/server/auth/authenticate';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import type { Handle } from '@sveltejs/kit';
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
			where: eq(users.id, accessToken.userId)
		});
	}

	const response = await resolve(event);

	return response;
};
