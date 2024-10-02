/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { getAppInsights } from '$lib/server/azure/insights';

let azureAppInsights: ApplicationInsights | undefined = undefined;

if (process.env.AZURE_APP_INSIGHTS_CONNECTION_STRING) {
	azureAppInsights = getAppInsights();
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logLevels: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info';

class Logger {
	private id: string;
	private path?: string;

	constructor(id: string, path?: string) {
		this.id = id;
		this.path = path;
		if (path && path.includes('/src/')) {
			this.path = `src/${path.split('/src/').pop()}`;
		}
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
				// this.path && `${colors.gray}${this.path}${resetColor}`
			);
			if (process.env.AZURE_APP_INSIGHTS_CONNECTION_STRING) {
				azureAppInsights?.trackTrace({
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

export const createLogger = (id: string, caller?: string) => new Logger(id, caller);

// import { ApplicationInsights } from '@microsoft/applicationinsights-web';
// import { getAppInsights } from './azure/insights';

// class Logger {
// 	private static instance: Logger;
// 	private appInsights: ApplicationInsights | undefined;

// 	private constructor() {
// 		this.appInsights = getAppInsights();
// 	}

// 	// Singleton pattern to get the logger instance
// 	public static getInstance(): Logger {
// 		if (!Logger.instance) {
// 			Logger.instance = new Logger();
// 		}
// 		return Logger.instance;
// 	}

// 	// Method to log regular messages
// 	public log(message: string): void {
// 		console.log(`[LOG]: ${message}`);
// 		if (this.appInsights) {
// 			this.appInsights.trackTrace({ message: `[LOG]: ${message}` });
// 		}
// 	}

// 	// Method to log errors
// 	public error(message: string, exception?: Error): void {
// 		console.error(`[ERROR]: ${message}`);
// 		if (this.appInsights) {
// 			this.appInsights.trackException({ exception, properties: { message } });
// 		}
// 	}

// 	// Method to log warnings
// 	public warn(message: string): void {
// 		console.warn(`[WARN]: ${message}`);
// 		if (this.appInsights) {
// 			this.appInsights.trackTrace({ message: `[WARN]: ${message}`, severityLevel: 2 });
// 		}
// 	}
// }

// // Usage example
// export const logger = Logger.getInstance();

// export default Logger;