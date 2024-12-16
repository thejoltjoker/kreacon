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
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	private log(level: LogLevel, message: string, ...args: any[]) {
		if (logLevels[level] >= logLevels[currentLogLevel]) {
			const colors = {
				debug: '\x1b[36m', // Cyan
				info: '\x1b[32m', // Green
				warn: '\x1b[33m', // Yellow
				error: '\x1b[31m', // Red
				cyan: '\x1b[36m',
				gray: '\x1b[90m'
			};
			const resetColor = '\x1b[0m';

			console[level](
				`${colors.gray}${new Date().toLocaleTimeString('en-US', { hour12: false })} ${colors.cyan}[${this.id}]${colors[level]} ${message}${resetColor}`,
				...args
			);
			if (azureAppInsights != null) {
				azureAppInsights.trackTrace({
					message: `[${this.id}] ${message}`,
					severityLevel: logLevels[level]
				});
			}
		}
	}

	debug(message: string, ...args: any[]) {
		this.log('debug', message, ...args);
	}

	info(message: string, ...args: any[]) {
		this.log('info', message, ...args);
	}

	warn(message: string, ...args: any[]) {
		this.log('warn', message, ...args);
	}

	error(message: string, ...args: any[]) {
		this.log('error', message, ...args);
	}
}

export const createLogger = (id: string) => new Logger(id);
