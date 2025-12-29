import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { dev } from '$app/environment';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,

	environment: dev ? 'development' : 'production',

	tracesSampleRate: dev ? 1.0 : 0.2,

	enableLogs: true,

	// Session replay configuration - GDPR compliant
	// NOTE: Session replay should only be enabled with explicit user consent
	// Consider implementing a cookie consent banner before enabling this
	replaysSessionSampleRate: 0, // Disabled by default for GDPR compliance
	replaysOnErrorSampleRate: 0, // Disabled by default for GDPR compliance

	integrations: [
		replayIntegration({
			// GDPR-compliant privacy settings
			maskAllText: true, // Mask all text to prevent PII capture
			blockAllMedia: true, // Block images/videos that may contain PII
			maskAllInputs: true, // Mask all input fields
			// Additional privacy settings
			networkDetailAllowUrls: [], // Don't capture network request details
			networkCaptureBodies: false // Don't capture request/response bodies
		})
	],

	// GDPR compliance: Never send PII
	sendDefaultPii: false,

	// Anonymize IP addresses (required for GDPR)
	beforeSend(event) {
		// Remove IP address if present
		if (event.user) {
			delete event.user.ip_address;
		}
		// Remove request IP if present
		if (event.request) {
			delete event.request.env;
		}
		return event;
	},

	ignoreErrors: [
		// Browser extensions
		'top.GLOBALS',
		// Random plugins/extensions
		'originalCreateNotification',
		'canvas.contentDocument',
		// Aborted fetch requests (user navigated away)
		'AbortError',
		'NetworkError',
		// ResizeObserver errors (benign)
		'ResizeObserver loop limit exceeded',
		'ResizeObserver loop completed with undelivered notifications'
	],

	beforeSendTransaction(event, hint) {
		if (dev) {
			console.log('Sentry event (dev mode):', event);
		}

		if (event.user) {
			delete event.user.ip_address;
			delete event.user.email;
		}

		if (event.request) {
			delete event.request.cookies;
			delete event.request.headers;
			delete event.request.env;
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
});

export const handleError = handleErrorWithSentry();
