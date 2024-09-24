class ServerError extends Error {
	constructor(
		public statusCode: number,
		public message: string
	) {
		super(message);
		this.name = 'ServerError';
		this.statusCode = statusCode;
	}
}

export default ServerError;
