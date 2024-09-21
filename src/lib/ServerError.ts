import type { StatusCodes } from 'http-status-codes';

class ServerError extends Error {
	constructor(
		public statusCode: StatusCodes,
		public message: string
	) {
		super(message);
		this.name = 'ServerError';
		this.statusCode = statusCode;
	}
}

export default ServerError;
