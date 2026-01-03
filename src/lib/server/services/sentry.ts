// Backend Sentry initialization
import * as Sentry from '@sentry/node';
import { dev } from '$app/environment';

if (!dev) {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: 'production',
		tracesSampleRate: 0.1,

		beforeSend(event) {
			if (event.level === 'info' || event.level === 'debug') {
				return null;
			}
			return event;
		}
	});
}

export { Sentry };
