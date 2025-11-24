import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
import sharp from 'sharp';
import { azureUploadBlob } from '$lib/server/azure/storage';
import { files } from '$lib/server/db/schema';
import db from '$lib/server/db';
import { createLogger } from '$lib/helpers/logger';
import { z } from 'zod/v4';
import { getAllowedMimeTypes, isAllowedMimeTypeForMedia } from '$lib/helpers/mediaTypes';
import { isAuthenticated } from '../../../(app)/utils';

const logger = createLogger('api/uploads/preview');

const previewConfig = {
	maxWidth: 1920,
	maxHeight: 1920,
	quality: 80,
	maxFileSize: 10 * 1024 * 1024 // 10MB
} as const;

const schema = z
	.object({
		file: z.instanceof(File).refine((file) => isAllowedMimeTypeForMedia(file.type, 'image'), {
			message: `File must be of type ${getAllowedMimeTypes('image').join(', ')}`
		}),
		maxSize: z.number().default(previewConfig.maxFileSize)
	})
	.refine((data) => data.file.size <= data.maxSize, {
		message: 'File size exceeds maximum allowed'
	});

export const PUT: RequestHandler = async ({ request, locals, url }) => {
	if (!isAuthenticated(locals)) {
		logger.warn('Unauthorized attempt to upload preview');
		return error(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	}

	const fileId = request.headers.get('x-file-id') ?? crypto.randomUUID();
	const originalName =
		url.searchParams.get('blobName') ?? request.headers.get('x-ms-blob-name') ?? 'unknown';
	const nameWithoutExtension =
		originalName.substring(0, originalName.lastIndexOf('.')) ?? originalName;
	const blobName = `${nameWithoutExtension}.webp`;

	try {
		logger.info('Starting preview processing', {
			contentType: request.headers.get('content-type'),
			blobName,
			fileId
		});

		const buffer = await request.arrayBuffer();
		const type = request.headers.get('content-type');
		const name = blobName;

		if (!type) {
			logger.warn('Missing content-type header');
			return error(StatusCodes.BAD_REQUEST, { message: 'Missing content-type header' });
		}

		const file = new File([buffer], name, { type });

		const result = schema.safeParse({ file });
		if (!result.success) {
			const issues = result.error.issues.map((issue) => issue.message).join(', ');
			logger.warn('Validation failed:', { issues, fileId });
			return error(StatusCodes.BAD_REQUEST, { message: issues });
		}

		const processedBuffer = await sharp(buffer)
			.resize(previewConfig.maxWidth, previewConfig.maxHeight, {
				withoutEnlargement: true
			})
			.webp({ quality: previewConfig.quality })
			.toBuffer();

		const url = await azureUploadBlob(blobName, processedBuffer, 'image/webp', 'previews');

		await db
			.insert(files)
			.values({
				id: fileId,
				name: file.name,
				type: file.type,
				url: url,
				size: processedBuffer.length
			})
			.returning();

		return new Response(null, {
			status: 201,
			headers: {
				'Content-Length': '0',
				'x-ms-request-id': crypto.randomUUID()
			}
		});
	} catch (err) {
		logger.error('Failed to process preview:', { error: err, fileId });
		return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to process preview' });
	}
};
