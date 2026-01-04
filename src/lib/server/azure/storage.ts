import env from '$lib/env';
import { xxhash } from '$lib/helpers/hashing';
import { createBackendLogger } from '$lib/server/logger';
import type { AzureStorageContainer } from '$lib/types/AzureStorageContainer';
import {
	BlobSASPermissions,
	BlobServiceClient,
	StorageSharedKeyCredential,
	type BlockBlobUploadOptions,
	type ContainerCreateOptions
} from '@azure/storage-blob';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import type { InsertFile } from '../db/schema/file';

const logger = createBackendLogger('azure-storage');

export const DEFAULT_STORAGE_CONTAINER: AzureStorageContainer = 'uploads';

export const getOrCreateContainer = async (
	blobServiceClient: BlobServiceClient,
	containerName: AzureStorageContainer,
	options?: ContainerCreateOptions
) => {
	const containerClient = blobServiceClient.getContainerClient(containerName);
	await containerClient.createIfNotExists(options);
	logger.info(`Container was created successfully.\n\tURL: ${containerClient.url}`);
	return containerClient;
};

export const getUploadsContainer = async () => {
	return await getOrCreateContainer(getBlobServiceClient(), 'uploads', {
		access: 'blob'
	});
};

export const getBlobServiceClient = () => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		env.AZURE_STORAGE_ACCOUNT_NAME,
		env.AZURE_STORAGE_ACCOUNT_KEY
	);
	return new BlobServiceClient(
		`https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
		sharedKeyCredential
	);
};

export const generateBlobSasUrl = async (
	containerName: AzureStorageContainer,
	blobName: string,
	expiryMinutes: number = 30
) => {
	const blobServiceClient = getBlobServiceClient();

	const containerClient = await getOrCreateContainer(blobServiceClient, containerName);
	const blobClient = containerClient.getBlobClient(blobName);

	const startsOn = new Date();
	const expiresOn = new Date(startsOn.valueOf() + 1000 * 60 * expiryMinutes);

	const permissions = BlobSASPermissions.from({
		create: true,
		write: true,
		delete: true
	});

	const blobSasUrl = blobClient.generateSasUrl({ permissions, expiresOn });

	return blobSasUrl;
};

export const azureUploadBlob = async (
	filename: string,
	data: Buffer | ArrayBuffer,
	contentType: string,
	containerName?: AzureStorageContainer,
	options?: BlockBlobUploadOptions,
	maxSizeInBytes?: number
) => {
	if (maxSizeInBytes == null) {
		maxSizeInBytes = env.BODY_SIZE_LIMIT ?? 10 * 1024 * 1024; // 10 MB
	}
	if (data.byteLength > maxSizeInBytes) {
		throw new Error(`Blob size exceeds the maximum allowed size of ${maxSizeInBytes} bytes`);
	}

	const blobServiceClient = getBlobServiceClient();
	const containerClient = await getOrCreateContainer(
		blobServiceClient,
		(containerName ?? 'uploads') as AzureStorageContainer,
		{
			access: 'blob'
		}
	);
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

export const uploadFile = async (file: File, container?: AzureStorageContainer) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	return await uploadBuffer(buffer, container);
};

export const uploadBuffer = async (
	buffer: Buffer | ArrayBuffer,
	blobName?: string,
	container?: AzureStorageContainer
) => {
	// Convert Buffer to Uint8Array if needed
	const bufferAsUint8Array = buffer instanceof Buffer ? new Uint8Array(buffer) : buffer;
	const fileType = await fileTypeFromBuffer(bufferAsUint8Array);
	if (fileType == null || fileType.ext == null || fileType.mime == null) {
		throw new Error('Failed to determine file type');
	}
	const { ext, mime } = fileType;
	if (blobName == null) {
		const checksum = xxhash(buffer);
		blobName = `${checksum}.${ext}`;
	}
	return await azureUploadBlob(blobName, buffer, mime, container);
};

// Client
export const upload = {
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

export const compressImageBlob = async (
	blobName: string,
	containerName: AzureStorageContainer,
	deleteOriginal: boolean = false,
	resizeTo: number = 2048,
	quality: number = 80
) => {
	const blobServiceClient = getBlobServiceClient();
	const containerClient = await getOrCreateContainer(blobServiceClient, containerName);

	const originalBlob = containerClient.getBlobClient(blobName);
	const filenameParts = blobName.split('_');
	const restOfFilename = filenameParts.slice(1).join('_');
	const filenameWithoutExt = restOfFilename.substring(0, restOfFilename.lastIndexOf('.'));
	const newBlobId = crypto.randomUUID();
	const newBlobName = `${newBlobId}_${filenameWithoutExt}.webp`;

	const downloadedBuffer = await originalBlob.downloadToBuffer();
	const compressedBuffer = await sharp(downloadedBuffer)
		.resize(resizeTo, resizeTo, { withoutEnlargement: true })
		.webp({ quality })
		.toBuffer();

	const newBlob = containerClient.getBlockBlobClient(newBlobName);
	await newBlob.uploadData(compressedBuffer, {
		blobHTTPHeaders: {
			blobContentType: 'image/webp'
		}
	});

	if (deleteOriginal) {
		await originalBlob.delete();
	}

	const result: InsertFile = {
		id: newBlobId,
		url: newBlob.url,
		name: newBlob.name,
		type: 'image/webp',
		size: compressedBuffer.byteLength
	};

	return result;
};

export const deleteBlobFromUrl = async (blobUrl: string): Promise<void> => {
	try {
		const url = new URL(blobUrl);
		const pathParts = url.pathname.split('/').filter((part) => part.length > 0);

		if (pathParts.length < 2) {
			logger.warn(`Invalid blob URL format: ${blobUrl}`);
			return;
		}

		const containerName = pathParts[0] as AzureStorageContainer;
		const blobName = pathParts.slice(1).join('/');

		const blobServiceClient = getBlobServiceClient();
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blobClient = containerClient.getBlobClient(blobName);

		await blobClient.delete();
		logger.info(`Deleted blob ${blobName} from container ${containerName}`);
	} catch (err: unknown) {
		logger.warn(`Failed to delete blob from URL ${blobUrl}:`, err);
	}
};
