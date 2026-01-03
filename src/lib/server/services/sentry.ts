// Backend Sentry initialization
import * as Sentry from '@sentry/node';

const dev = process.env.NODE_ENV !== 'production';

const sentryDsn = process.env.PUBLIC_SENTRY_DSN;

if (!dev && sentryDsn) {
	Sentry.init({
		dsn: sentryDsn,
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
