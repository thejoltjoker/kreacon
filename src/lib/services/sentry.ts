// Frontend Sentry initialization
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';

const dsn = import.meta.env.SENTRY_DSN ?? import.meta.env.PUBLIC_SENTRY_DSN;

Sentry.init({
	dsn,
	environment: dev ? 'development' : 'production',
	tracesSampleRate: 0.1,

	beforeSend(event) {
		if (event.level === 'info' || event.level === 'debug') {
			return null;
		}
		return event;
	}
});

export { Sentry };
