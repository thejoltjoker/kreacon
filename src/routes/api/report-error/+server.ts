import { createLogger } from '$lib/helpers/logger';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
const logger = createLogger('client-error');

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json();
	logger.error('Client error');
	logger.error('User:', event.locals.user);
	logger.error('IP:', event.getClientAddress());
	logger.error('Error:', data);

	return new Response(null, { status: StatusCodes.OK });
};
