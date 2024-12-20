import env from '$lib/env';
import { fileTypeFromFile } from 'file-type';
import { xxhash } from '$lib/helpers/hashing';
import { createLogger } from '$lib/helpers/logger';
import { DefaultAzureCredential } from '@azure/identity';
import {
	BlobServiceClient,
	type BlockBlobUploadOptions,
	type ContainerCreateOptions
} from '@azure/storage-blob';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
export const blobServiceClient = new BlobServiceClient(
	`https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
	new DefaultAzureCredential()
);

const logger = createLogger('azure-storage');

export const getOrCreateContainer = async (
	containerName: string,
	options?: ContainerCreateOptions
) => {
	const containerClient = blobServiceClient.getContainerClient(containerName);
	await containerClient.createIfNotExists(options);
	logger.info(`Container was created successfully.\n\tURL: ${containerClient.url}`);
	return containerClient;
};

export const getUploadsContainer = async () => {
	return await getOrCreateContainer('kreacon-dev-uploads', { access: 'blob' });
};

// TODO
export const azureUploadBlob = async (
	filename: string,
	data: Buffer | ArrayBuffer,
	contentType: string,
	containerName?: string,
	options?: BlockBlobUploadOptions
) => {
	const containerClient = await getOrCreateContainer(containerName ?? 'uploads', {
		access: 'blob'
	});
	const blockBlobClient = containerClient.getBlockBlobClient(filename);

	try {
		const uploadOptions: BlockBlobUploadOptions = {
			blobHTTPHeaders: {
				blobContentType: contentType
			},
			...options
		};
		await blockBlobClient.upload(data, data.byteLength, uploadOptions);
		logger.info(`Uploaded blob ${filename} successfully`);

		return blockBlobClient.url;
	} catch (err: unknown) {
		logger.error('Failed to upload blob:', err);
		throw err;
	}
};

export const uploadFile = async (file: File, container?: string) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	return await uploadBuffer(buffer, container);
};

export const uploadBuffer = async (buffer: Buffer | ArrayBuffer, container?: string) => {
	const fileType = await fileTypeFromBuffer(buffer);
	if (fileType == null || fileType.ext == null || fileType.mime == null) {
		throw new Error('Failed to determine file type');
	}
	const { ext, mime } = fileType;
	const checksum = xxhash(buffer);
	const blobName = `${checksum}.${ext}`;
	return await azureUploadBlob(blobName, buffer, mime, container);
};

// Client
export const upload = {
	thumbnail: async (file: File) => {
		return await uploadFile(file);
	},
	video: async (file: File) => {
		return await uploadFile(file);
	},
	audio: async (file: File) => {
		return await uploadFile(file);
	},
	image: async (file: File) => {
		return await uploadFile(file);
	},
	avatar: async (file: File) => {
		return await uploadFile(file);
	}
};
