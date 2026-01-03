import * as Sentry from '@sentry/sveltekit';

// If you don't want to use Session Replay, remove the `Replay` integration,
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
	dsn: 'https://f96344f191d1b3836c57c023b8aabb10@o4510613286551552.ingest.de.sentry.io/4510613288190032',
	tracesSampleRate: 1,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.replayIntegration()],
	enableLogs: true,
	sendDefaultPii: true
});

export const handleError = Sentry.handleErrorWithSentry();
