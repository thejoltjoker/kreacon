// Backend Sentry initialization
import * as Sentry from '@sentry/node';
import { dev } from '$app/environment';

Sentry.init({
	dsn: dev ? undefined : process.env.SENTRY_DSN,
	environment: dev ? 'development' : 'production',
	tracesSampleRate: dev ? 0 : 0.1,

	beforeSend(event) {
		if (event.level === 'info' || event.level === 'debug') {
			return null;
		}
		return event;
	}
});

export { Sentry };
