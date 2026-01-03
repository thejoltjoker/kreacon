import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: import.meta.env.PUBLIC_SENTRY_DSN,
	// TODO Change back to reasonable sample rate when we have more data
	// tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
	tracesSampleRate: 1.0,
	enableLogs: true,
	// replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
	replaysSessionSampleRate: 1.0,
	replaysOnErrorSampleRate: 1.0, // This is correct
	integrations: [replayIntegration()],
	sendDefaultPii: true
});
// TODO If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
