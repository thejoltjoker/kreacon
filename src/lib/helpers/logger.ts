/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from '@sentry/sveltekit';
import env from '../env';
import type { LogLevel } from '../types/LogLevel';

// AZURE APP INSIGHTS CODE (KEPT FOR FUTURE REFERENCE)
// import type { ApplicationInsights } from '@microsoft/applicationinsights-web';
// import { getAppInsights } from '../server/azure/insights';
//
// let azureAppInsights: ApplicationInsights | undefined = undefined;
//
// if (env.AZURE_APP_INSIGHTS_CONNECTION_STRING) {
// 	azureAppInsights = getAppInsights();
// }

const logLevels: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

const currentLogLevel: LogLevel = (env.LOG_LEVEL as LogLevel) ?? 'info';

class Logger {
	private context: string;

	constructor(context: string) {
		this.context = context;
	}

	formatMessage(message: string, level: LogLevel) {
		const colors = {
			debug: '\x1b[36m', // Cyan
			info: '\x1b[32m', // Green
			warn: '\x1b[33m', // Yellow
			error: '\x1b[31m', // Red
			cyan: '\x1b[36m',
			gray: '\x1b[90m'
		};
		const resetColor = '\x1b[0m';

		return `${colors.gray}${new Date().toLocaleTimeString('en-US', { hour12: false })} ${colors.cyan}[${this.context}]${colors[level]} ${message}${resetColor}`;
	}

	debug(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'debug');
		if (logLevels[currentLogLevel] <= logLevels['debug']) {
			console.debug(formattedMessage, data);
		}

		// Send to Sentry
		Sentry.captureMessage(`[${this.context}] ${message}`, {
			level: 'debug',
			extra: data
		});

		// AZURE CODE (kept for reference):
		// if (azureAppInsights != null) {
		// 	azureAppInsights.trackTrace({
		// 		message: `[${this.context}] ${message}`,
		// 		properties: data,
		// 		severityLevel: logLevels['debug']
		// 	});
		// }
	}

	info(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'info');
		if (logLevels[currentLogLevel] <= logLevels['info']) {
			console.info(formattedMessage, data);
		}

		// Send to Sentry
		Sentry.captureMessage(`[${this.context}] ${message}`, {
			level: 'info',
			extra: data
		});

		// AZURE CODE (kept for reference):
		// if (azureAppInsights != null) {
		// 	azureAppInsights.trackTrace({
		// 		message: `[${this.context}] ${message}`,
		// 		properties: data,
		// 		severityLevel: logLevels['info']
		// 	});
		// }
	}

	warn(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'warn');
		if (logLevels[currentLogLevel] <= logLevels['warn']) {
			console.warn(formattedMessage, data);
		}

		// Send to Sentry
		Sentry.captureMessage(`[${this.context}] ${message}`, {
			level: 'warning',
			extra: data
		});

		// AZURE CODE (kept for reference):
		// if (azureAppInsights != null) {
		// 	azureAppInsights.trackTrace({
		// 		message: `[${this.context}] ${message}`,
		// 		properties: data,
		// 		severityLevel: logLevels['warn']
		// 	});
		// }
	}

	error(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'error');
		if (logLevels[currentLogLevel] <= logLevels['error']) {
			console.error(formattedMessage, data);
		}

		// Send to Sentry
		if (data instanceof Error) {
			Sentry.captureException(data, {
				contexts: {
					logger: {
						context: this.context,
						message: message
					}
				},
				extra: { originalMessage: message }
			});
		} else {
			Sentry.captureException(new Error(`[${this.context}] ${message}`), {
				extra: data
			});
		}

		// AZURE CODE (kept for reference):
		// if (azureAppInsights != null) {
		// 	azureAppInsights.trackException({
		// 		exception: new Error(message),
		// 		properties: data
		// 	});
		// }
	}
}

export const createLogger = (context: string) => new Logger(context);
