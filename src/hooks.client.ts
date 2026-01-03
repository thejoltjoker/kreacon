import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: '',
	tracesSampleRate: import.meta.env.DEV ? 1.0 : 1.0,
	enableLogs: true,
	replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
	replaysOnErrorSampleRate: 1.0,
	integrations: [replayIntegration()],
	sendDefaultPii: true
});
// TODO If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
