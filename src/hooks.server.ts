import * as Sentry from '@sentry/sveltekit';
import {
	deleteSessionTokenCookie,
	sessionCookieName,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/auth';
import { type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(sessionToken);
	if (session) {
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handleI18n: Handle = async ({ event, resolve }) => {
	// i18n
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}
	return resolve(event);
};

export const handle = sequence(Sentry.sentryHandle(), sequence(handleI18n, handleAuth));
export const handleError = Sentry.handleErrorWithSentry();
