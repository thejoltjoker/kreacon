/* eslint-disable @typescript-eslint/no-explicit-any */
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
				...args,
				`${colors.gray}${this.path}${resetColor}`
			);
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

export const createLogger = (id: string, caller: string) => new Logger(id, caller);
