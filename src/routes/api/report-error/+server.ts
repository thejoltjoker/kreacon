import { createBackendLogger } from '$lib/server/logger';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
const logger = createBackendLogger('client-error');

export const POST: RequestHandler = async (event) => {
	// TODO Rate limit
	const data = await event.request.json();
	logger.error('Client error');
	logger.error('User:', event.locals.user);
	logger.error('Client IP address:', event.getClientAddress());
	logger.error('Error data received from client:', data);

	return new Response(null, { status: StatusCodes.OK });
};
