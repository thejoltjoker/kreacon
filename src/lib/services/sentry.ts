// Frontend Sentry initialization
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';

if (!dev) {
	Sentry.init({
		dsn: import.meta.env.PUBLIC_SENTRY_DSN,
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
