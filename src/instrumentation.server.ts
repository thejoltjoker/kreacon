import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,

	environment: import.meta.env.MODE || 'production',

	tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,

	integrations: [Sentry.postgresIntegration()],

	enableLogs: true,

	sendDefaultPii: false,

	ignoreErrors: [
		// Browser extensions
		'top.GLOBALS',
		// Random plugins/extensions
		'originalCreateNotification',
		'canvas.contentDocument',
		'MyApp_RemoveAllHighlights',
		// Facebook borked
		'fb_xd_fragment',
		// ISP optimizing proxy - `Cache-Control: no-transform` seems to reduce this
		'bmi_SafeAddOnload',
		'EBCallBackMessageReceived',
		// See http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
		"Can't find variable: ZiteReader",
		'jigsaw is not defined',
		'ComboSearch is not defined',
		// Aborted fetch requests (user navigated away)
		'AbortError',
		'NetworkError'
	],

	beforeSend(event, hint) {
		if (event.user) {
			delete event.user.ip_address;
			delete event.user.email;
		}

		if (event.request) {
			delete event.request.cookies;
			delete event.request.headers;
			delete event.request.env;
		}

		if (event.extra) {
			const piiFields = ['email', 'password', 'token', 'apiKey', 'secret', 'ssn', 'phone'];
			for (const field of piiFields) {
				if (field in event.extra) {
					delete event.extra[field];
				}
			}
		}

		if (event.exception) {
			const error = hint.originalException;
			if (error && typeof error === 'object' && 'message' in error) {
				const message = String(error.message);
				if (
					message.includes('Failed to fetch') ||
					message.includes('NetworkError') ||
					message.includes('Load failed')
				) {
					return null;
				}
			}
		}
		return event;
	}

	// spotlight: import.meta.env.DEV,
});
