// Backend Sentry initialization
import * as Sentry from '@sentry/node';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

if (!dev) {
	Sentry.init({
		dsn: env.PUBLIC_SENTRY_DSN,
		environment: dev ? 'development' : 'production',
		// TODO Change back to reasonable sample rate when we have more data
		// tracesSampleRate: dev ? 0 : 0.1,
		tracesSampleRate: 1,

		beforeSend(event) {
			if (event.level === 'info' || event.level === 'debug') {
				return null;
			}
			return event;
		}
	});
}

export { Sentry };
