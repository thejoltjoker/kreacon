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
		Sentry.setUser(null);
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

	if (user) {
		Sentry.setUser({
			id: user.id,
			username: user.username
		});

		Sentry.setTag('user_status', user.status);
		Sentry.setTag('email_verified', user.emailVerifiedAt ? 'true' : 'false');
	} else {
		Sentry.setUser(null);
	}

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

const handleSentryContext: Handle = async ({ event, resolve }) => {
	Sentry.setContext('request', {
		method: event.request.method,
		url: event.url.pathname,
		query_present: event.url.search ? 'yes' : 'no'
	});

	Sentry.setTag('route', event.route.id ?? 'unknown');
	Sentry.setTag('method', event.request.method);

	return resolve(event);
};

export const handle = sequence(Sentry.sentryHandle(), handleSentryContext, handleI18n, handleAuth);
export const handleError = Sentry.handleErrorWithSentry();
