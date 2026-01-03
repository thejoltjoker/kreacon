import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import sharp from 'sharp';
import { azureUploadBlob } from '$lib/server/azure/storage';
import { files } from '$lib/server/db/schema';
import db from '$lib/server/db';
import { createLogger } from '$lib/helpers/logger';
import { z } from 'zod/v4';
import { getAllowedMimeTypes, isAllowedMimeTypeForMedia } from '$lib/helpers/mediaTypes';
import { isAuthenticated, isEmailVerified } from '../../../(app)/utils';
import type { RequestHandler } from './$types';

const logger = createLogger('api/uploads/avatar');

const avatarConfig = {
	maxWidth: 320,
	maxHeight: 320,
	quality: 80,
	maxFileSize: 10 * 1024 * 1024 // 10MB
} as const;

const schema = z
	.object({
		file: z.instanceof(File).refine((file) => isAllowedMimeTypeForMedia(file.type, 'image'), {
			message: `File must be of type ${getAllowedMimeTypes('image').join(', ')}`
		}),
		maxSize: z.number().default(avatarConfig.maxFileSize)
	})
	.refine((data) => data.file.size <= data.maxSize, {
		message: 'File size exceeds maximum allowed'
	});

export const PUT: RequestHandler = async ({ request, locals, url }) => {
	if (!isAuthenticated(locals)) {
		logger.warn('Unauthorized attempt to upload avatar');
		return error(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	}

	if (!isEmailVerified(locals)) {
		logger.warn(`Unverified user ${locals.user?.id} attempted to upload avatar`);
		return error(StatusCodes.FORBIDDEN, { message: 'Email verification required' });
	}

	const fileId = request.headers.get('x-file-id') ?? crypto.randomUUID();
	const originalName =
		url.searchParams.get('blobName') ?? request.headers.get('x-ms-blob-name') ?? 'unknown';
	const nameWithoutExtension =
		originalName.substring(0, originalName.lastIndexOf('.')) ?? originalName;
	const blobName = `${nameWithoutExtension}.webp`;

	try {
		logger.info('Starting avatar processing', {
			contentType: request.headers.get('content-type'),
			blobName,
			fileId
		});

		const buffer = await request.arrayBuffer();
		const rawType = request.headers.get('content-type');

		if (!rawType) {
			logger.warn('Missing content-type header');
			return error(StatusCodes.BAD_REQUEST, { message: 'Missing content-type header' });
		}

		const type = rawType.toLowerCase();
		const name = blobName;

		const file = new File([buffer], name, { type });

		const result = schema.safeParse({ file });
		if (!result.success) {
			const issues = result.error.issues.map((issue) => issue.message).join(', ');
			logger.warn('Validation failed:', { issues, fileId });
			return error(StatusCodes.BAD_REQUEST, { message: issues });
		}

		const sharpBuffer = Buffer.from(buffer);
		const processedBuffer = await sharp(sharpBuffer)
			.resize(avatarConfig.maxWidth, avatarConfig.maxHeight, {
				withoutEnlargement: true
			})
			.webp({ quality: avatarConfig.quality })
			.toBuffer();

		const url = await azureUploadBlob(blobName, processedBuffer, 'image/webp', 'avatars');

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
		const errorObj = err instanceof Error ? err : new Error(String(err));

		Object.assign(errorObj, {
			fileId,
			contentType: request.headers.get('content-type'),
			bufferSize: request.headers.get('content-length'),
			blobName,
			originalName
		});

		logger.error('Failed to process avatar', errorObj);

		const errorMessage = errorObj.message;
		return error(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: `Failed to process avatar: ${errorMessage}`
		});
	}
};
