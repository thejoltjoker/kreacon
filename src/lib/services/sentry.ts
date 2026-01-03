// Frontend Sentry initialization
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';

const dsn = import.meta.env.SENTRY_DSN ?? import.meta.env.PUBLIC_SENTRY_DSN;

Sentry.init({
	dsn,
	environment: dev ? 'development' : 'production',
	// TODO Change back to reasonable sample rate when we have more data
	// tracesSampleRate: 0.1,
	tracesSampleRate: 1.0,

	beforeSend(event) {
		if (event.level === 'info' || event.level === 'debug') {
			return null;
		}
		return event;
	}
});

export { Sentry };
