import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';
import { azureUploadBlob } from '$lib/server/azure/storage';
import { files } from '$lib/server/db/schema';
import db from '$lib/server/db';
import { createBackendLogger } from '$lib/server/logger';
import { z } from 'zod/v4';
import { getAllowedMimeTypes, isAllowedMimeTypeForMedia } from '$lib/helpers/mediaTypes';
import { isAuthenticated } from '../../../(app)/utils';

const logger = createBackendLogger('api/uploads/proof');

const proofConfig = {
	maxFileSize: 512 * 1024 * 1024 // 512MB
} as const;

const schema = z
	.object({
		file: z.instanceof(File).refine((file) => isAllowedMimeTypeForMedia(file.type, 'archive'), {
			message: `File must be of type ${getAllowedMimeTypes('archive').join(', ')}`
		}),
		maxSize: z.number().default(proofConfig.maxFileSize)
	})
	.refine((data) => data.file.size <= data.maxSize, {
		message: 'File size exceeds maximum allowed'
	});

export const PUT: RequestHandler = async ({ request, locals, url }) => {
	if (!isAuthenticated(locals)) {
		logger.warn('Unauthorized attempt to upload proof');
		return error(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	}

	const fileId = request.headers.get('x-file-id') ?? crypto.randomUUID();
	const blobName =
		url.searchParams.get('blobName') ?? request.headers.get('x-ms-blob-name') ?? 'unknown';

	try {
		logger.info('Starting proof upload', {
			contentType: request.headers.get('content-type'),
			blobName,
			fileId
		});

		const buffer = await request.arrayBuffer();
		const type = request.headers.get('content-type');

		if (!type) {
			logger.warn('Missing content-type header');
			return error(StatusCodes.BAD_REQUEST, { message: 'Missing content-type header' });
		}

		const file = new File([buffer], blobName, { type });

		const result = schema.safeParse({ file });
		if (!result.success) {
			const issues = result.error.issues.map((issue) => issue.message).join(', ');
			logger.warn('Validation failed:', { issues, fileId });
			return error(StatusCodes.BAD_REQUEST, { message: issues });
		}

		const fileUrl = await azureUploadBlob(blobName, Buffer.from(buffer), type, 'proofs');

		await db
			.insert(files)
			.values({
				id: fileId,
				name: file.name,
				type: file.type,
				url: fileUrl,
				size: buffer.byteLength
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
		logger.error('Failed to upload proof:', { error: err, fileId });
		return error(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Failed to upload proof' });
	}
};
