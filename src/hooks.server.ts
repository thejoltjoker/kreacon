import { authenticate } from '$lib/auth/authenticate';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await authenticate(event);

	const response = await resolve(event);

	return response;
};
