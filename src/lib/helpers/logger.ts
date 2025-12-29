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

		Sentry.addBreadcrumb({
			category: this.context,
			message: message,
			level: 'debug',
			data: data
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

		Sentry.addBreadcrumb({
			category: this.context,
			message: message,
			level: 'info',
			data: data
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

		Sentry.addBreadcrumb({
			category: this.context,
			message: message,
			level: 'warning',
			data: data
		});

		Sentry.captureMessage(message, {
			level: 'warning',
			tags: {
				logger_context: this.context,
				log_level: 'warn'
			},
			contexts: {
				logger: {
					context: this.context,
					timestamp: new Date().toISOString()
				}
			},
			extra: data,
			fingerprint: [this.context, message]
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

		Sentry.addBreadcrumb({
			category: this.context,
			message: message,
			level: 'error',
			data: data
		});

		if (data instanceof Error) {
			Sentry.captureException(data, {
				tags: {
					logger_context: this.context,
					log_level: 'error',
					error_type: data.name
				},
				contexts: {
					logger: {
						context: this.context,
						message: message,
						timestamp: new Date().toISOString()
					}
				},
				extra: {
					originalMessage: message,
					errorStack: data.stack,
					...this.extractErrorDetails(data)
				},
				fingerprint: [this.context, data.name, message]
			});
		} else {
			const error = new Error(message);
			error.name = `${this.context}Error`;

			Sentry.captureException(error, {
				tags: {
					logger_context: this.context,
					log_level: 'error'
				},
				contexts: {
					logger: {
						context: this.context,
						timestamp: new Date().toISOString()
					}
				},
				extra: data,
				fingerprint: [this.context, message]
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

	private extractErrorDetails(error: Error): Record<string, any> {
		const details: Record<string, any> = {
			errorName: error.name,
			errorMessage: error.message
		};

		Object.keys(error).forEach((key) => {
			if (key !== 'stack' && key !== 'message' && key !== 'name') {
				details[key] = (error as any)[key];
			}
		});

		return details;
	}
}

export const createLogger = (context: string) => new Logger(context);
