/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { getAppInsights } from '../server/azure/insights';
import env from '../env';
import type { LogLevel } from '../types/LogLevel';

let azureAppInsights: ApplicationInsights | undefined = undefined;

if (env.AZURE_APP_INSIGHTS_CONNECTION_STRING) {
	azureAppInsights = getAppInsights();
}

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

	formatMessage(message: string, level: LogLevel, destination: 'console' | 'azure' = 'console') {
		const colors = {
			debug: '\x1b[36m', // Cyan
			info: '\x1b[32m', // Green
			warn: '\x1b[33m', // Yellow
			error: '\x1b[31m', // Red
			cyan: '\x1b[36m',
			gray: '\x1b[90m'
		};
		const resetColor = '\x1b[0m';

		if (destination === 'azure') {
			return `[${this.context}] ${message}`;
		}
		return `${colors.gray}${new Date().toLocaleTimeString('en-US', { hour12: false })} ${colors.cyan}[${this.context}]${colors[level]} ${message}${resetColor}`;
	}

	debug(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'debug');
		if (logLevels[currentLogLevel] >= logLevels['debug']) {
			console.debug(formattedMessage, data);
		}
		if (azureAppInsights != null) {
			azureAppInsights.trackTrace({
				message: formattedMessage,
				properties: data,
				severityLevel: logLevels['debug']
			});
		}
	}
	info(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'info');
		if (logLevels[currentLogLevel] >= logLevels['info']) {
			console.info(formattedMessage, data);
		}
		if (azureAppInsights != null) {
			azureAppInsights.trackTrace({
				message: formattedMessage,
				properties: data,
				severityLevel: logLevels['info']
			});
		}
	}

	warn(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'warn');
		if (logLevels[currentLogLevel] >= logLevels['warn']) {
			console.warn(formattedMessage, data);
		}
		if (azureAppInsights != null) {
			azureAppInsights.trackTrace({
				message: formattedMessage,
				properties: data,
				severityLevel: logLevels['warn']
			});
		}
	}

	error(message: string, data?: any) {
		const formattedMessage = this.formatMessage(message, 'error');
		if (logLevels[currentLogLevel] >= logLevels['error']) {
			console.error(formattedMessage, data);
		}
		if (azureAppInsights != null) {
			azureAppInsights.trackException({ exception: new Error(message), properties: data });
		}
	}
}

export const createLogger = (context: string) => new Logger(context);
