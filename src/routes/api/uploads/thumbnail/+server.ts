import { error, json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
import sharp from 'sharp';
import { uploadBuffer } from '$lib/server/azure/storage';
import { files } from '$lib/server/db/schema';
import db from '$lib/server/db';
import { createLogger } from '$lib/helpers/logger';
import { isAuthenticated } from '../../../(app)/utils';
import { z } from 'zod';
import { MimeTypeMap } from '$lib/types/mediaTypes';
import {
	getAllowedMimeTypes,
	getMimeTypesForMedia,
	isAllowedMimeTypeForMedia
} from '$lib/helpers/mediaTypes';

const logger = createLogger('api/uploads/thumbnail');

const schema = z.object({
	file: z.instanceof(File).refine(
		(file) => {
			return isAllowedMimeTypeForMedia(file.type, 'image');
		},
		{
			message: `File must be of type ${getAllowedMimeTypes('image').join(', ')}`
		}
	)
});

export const POST: RequestHandler = async ({ request, locals }) => {
	// TODO Enable this
	// if (!isAuthenticated(locals)) {
	// 	return error(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	// }

	try {
		const buffer = await request.arrayBuffer();
		const type = request.headers.get('x-file-type');
		const name = request.headers.get('x-file-name');

		if (!type || !name) {
			return error(StatusCodes.BAD_REQUEST, { message: 'Missing file metadata headers' });
		}

		const file = new File([buffer], name, { type });

		const result = schema.safeParse({ file });
		if (!result.success) {
			const issues = result.error.issues.map((issue) => issue.message).join(', ');
			logger.error('Validation failed:', issues);
			return error(StatusCodes.BAD_REQUEST, { message: issues });
		}

		const processedBuffer = await sharp(buffer).resize(2048).jpeg({ quality: 80 }).toBuffer();

		const url = await uploadBuffer(processedBuffer, 'thumbnails');

		const [fileRecord] = await db
			.insert(files)
			.values({
				name: file.name,
				type: file.type,
				url: url,
				size: processedBuffer.length
			})
			.returning();

		return json({
			success: true,
			file: fileRecord
		});
	} catch (err) {
		logger.error('Failed to process thumbnail:', err);
		return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to process thumbnail' });
	}
};
