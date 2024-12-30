import { error, json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
import sharp from 'sharp';
import { azureUploadBlob, uploadBuffer } from '$lib/server/azure/storage';
import { files } from '$lib/server/db/schema';
import db from '$lib/server/db';
import { createLogger } from '$lib/helpers/logger';
import { z } from 'zod';
import { getAllowedMimeTypes, isAllowedMimeTypeForMedia } from '$lib/helpers/mediaTypes';
import { isAuthenticated } from '../../../(app)/utils';

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

export const PUT: RequestHandler = async ({ request, locals, url }) => {
	if (!isAuthenticated(locals)) {
		logger.warn('Unauthorized attempt to upload thumbnail');
		return error(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	}

	const fileId = request.headers.get('x-file-id') ?? crypto.randomUUID();
	const originalName =
		url.searchParams.get('blobName') ?? request.headers.get('x-ms-blob-name') ?? 'unknown';
	const nameWithoutExtension =
		originalName.substring(0, originalName.lastIndexOf('.')) ?? originalName;
	const blobName = `${nameWithoutExtension}.webp`;

	try {
		logger.info('Starting thumbnail processing', {
			contentType: request.headers.get('content-type'),
			blobName
		});

		const buffer = await request.arrayBuffer();
		const type = request.headers.get('content-type');
		const name = blobName;

		if (!type) {
			logger.warn('Missing content-type header');
			return error(StatusCodes.BAD_REQUEST, { message: 'Missing content-type header' });
		}

		const file = new File([buffer], name, { type });
		logger.debug('Created file object', { name, type, size: buffer.byteLength });

		const result = schema.safeParse({ file });
		if (!result.success) {
			const issues = result.error.issues.map((issue) => issue.message).join(', ');
			logger.error('Validation failed:', issues);
			return error(StatusCodes.BAD_REQUEST, { message: issues });
		}

		logger.debug('Starting image processing with Sharp');
		const processedBuffer = await sharp(buffer)
			.resize(1920, 1920, { withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
		logger.debug('Image processing complete', {
			originalSize: buffer.byteLength,
			processedSize: processedBuffer.length
		});

		logger.debug('Uploading to Azure storage');
		const url = await azureUploadBlob(blobName, processedBuffer, 'image/webp', 'thumbnails');
		logger.info('Upload successful', { url });

		const [fileRecord] = await db
			.insert(files)
			.values({
				id: fileId,
				name: file.name,
				type: file.type,
				url: url,
				size: processedBuffer.length
			})
			.returning();
		logger.info('Database record created', { fileId: fileRecord.id });

		return new Response(null, {
			status: 201,
			headers: {
				'Content-Length': '0',
				'x-ms-request-id': crypto.randomUUID()
			}
		});
	} catch (err) {
		logger.error('Failed to process thumbnail:', err);
		return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to process thumbnail' });
	}
};
