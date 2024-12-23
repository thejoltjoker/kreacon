import { createLogger } from '$lib/helpers/logger';
import { generateBlobSasUrl } from '$lib/server/azure/storage';
import db from '$lib/server/db';
import { files } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
import { getUrlSchema } from './schema';

const logger = createLogger('api/uploads/get-url');

export const POST: RequestHandler = async ({ locals, request }) => {
	// TODO Uncomment this
	// if (!isAuthenticated(locals)) {
	// 	return error(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	// }
	const data = await request.json();

	const parsed = getUrlSchema.safeParse(data);

	if (!parsed.success) {
		const issues = parsed.error.issues.map((issue) => issue.message).join(', ');
		logger.error('Parsing request body failed', issues);
		return error(StatusCodes.BAD_REQUEST, { message: 'Invalid request' });
	}

	const sasUrl = await generateBlobSasUrl(data.container, data.name);

	try {
		const [file] = await db
			.insert(files)
			.values({
				id: data.uuid,
				name: data.name,
				type: data.type,
				url: sasUrl,
				size: 0,
				checksum: data.checksum
			})
			.returning();

		return json({ url: sasUrl, fileId: file.id });
	} catch (err) {
		logger.error('Failed to insert file', err);
		return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to insert file' });
	}
};
