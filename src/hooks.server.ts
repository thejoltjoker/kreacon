import { authenticate } from '$lib/server/auth/authenticate';
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	// i18n
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}

	// auth
	const user = await authenticate(event);
	event.locals.userId = user?.userId;

	const response = await resolve(event);

	return response;
};
