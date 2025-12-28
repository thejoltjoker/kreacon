import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://f96344f191d1b3836c57c023b8aabb10@o4510613286551552.ingest.de.sentry.io/4510613288190032',

	tracesSampleRate: 1.0,

	// Enable logs to be sent to Sentry
	enableLogs: true

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
