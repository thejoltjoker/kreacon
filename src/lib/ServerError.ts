import type { StatusCodes } from 'http-status-codes';

class ServerError extends Error {
	constructor(
		public message: string,
		public statusCode: StatusCodes
	) {
		super(message);
		this.name = 'ServerError';
		this.statusCode = statusCode;
	}
}

export default ServerError;
