// Server side logger
import { dev } from '$app/environment';
import { Sentry } from './services/sentry';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function log(context: string, level: LogLevel, message: string, extra?: unknown) {
	switch (level) {
		case 'debug':
			console.debug(`[${context}] ${message}`, extra);
			break;
		case 'info':
			console.info(`[${context}] ${message}`, extra);
			break;
		case 'warn':
			console.warn(`[${context}] ${message}`, extra);
			break;
		case 'error':
			console.error(`[${context}] ${message}`, extra);
			break;
	}

	if (!dev && (level === 'warn' || level === 'error')) {
		if (level === 'error') {
			Sentry.captureException(
				extra instanceof Error ? extra : new Error(`[${context}] ${message}`)
			);
		} else {
			Sentry.captureMessage(`[${context}] ${message}`, 'warning');
		}
	}
}

export const logger = {
	debug: (context: string, msg: string, extra?: unknown) => log(context, 'debug', msg, extra),
	info: (context: string, msg: string, extra?: unknown) => log(context, 'info', msg, extra),
	warn: (context: string, msg: string, extra?: unknown) => log(context, 'warn', msg, extra),
	error: (context: string, msg: string, extra?: unknown) => log(context, 'error', msg, extra)
};

export const createBackendLogger = (context: string) => ({
	debug: (msg: string, extra?: unknown) => log(context, 'debug', msg, extra),
	info: (msg: string, extra?: unknown) => log(context, 'info', msg, extra),
	warn: (msg: string, extra?: unknown) => log(context, 'warn', msg, extra),
	error: (msg: string, extra?: unknown) => log(context, 'error', msg, extra)
});
