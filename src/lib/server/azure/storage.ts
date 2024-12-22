import env from '$lib/env';
import { xxhash } from '$lib/helpers/hashing';
import { createLogger } from '$lib/helpers/logger';
import { DefaultAzureCredential } from '@azure/identity';
import {
	BlobSASPermissions,
	BlobServiceClient,
	ContainerSASPermissions,
	generateBlobSASQueryParameters,
	SASProtocol,
	StorageSharedKeyCredential,
	type BlockBlobUploadOptions,
	type ContainerCreateOptions
} from '@azure/storage-blob';
import { fileTypeFromBuffer } from 'file-type';
export const blobServiceClient = new BlobServiceClient(
	`https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
	new DefaultAzureCredential()
);

export const DEFAULT_STORAGE_CONTAINER = 'kreacon-dev-uploads';

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

export const generateBlobSasUrl = async (
	containerName: string,
	blobName: string,
	expiryMinutes: number = 30
) => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		env.AZURE_STORAGE_ACCOUNT_NAME,
		env.AZURE_STORAGE_ACCOUNT_KEY
	);

	const blobServiceClient = new BlobServiceClient(
		`https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
		sharedKeyCredential
	);

	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blobClient = containerClient.getBlobClient(blobName);

	// SAS
	const startsOn = new Date();
	const expiresOn = new Date(startsOn.valueOf() + 1000 * 60 * expiryMinutes);

	const permissions = BlobSASPermissions.from({
		create: true,
		write: true
	});

	const blobSasUrl = blobClient.generateSasUrl({ permissions, expiresOn });

	// const blobSAS = generateBlobSASQueryParameters(
	// 	{
	// 		containerName,
	// 		blobName,
	// 		permissions: BlobSASPermissions.parse('racwd'),
	// 		startsOn: new Date(),
	// 		expiresOn: new Date(new Date().valueOf() + 86400)
	// 	},
	// 	sharedKeyCredential
	// ).toString();

	// const sasUrl = blobClient.url + '?' + blobSAS;

	return blobSasUrl;
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

generateBlobSasUrl(DEFAULT_STORAGE_CONTAINER, 'imag2e.jpg').then((sasToken) => {
	console.log(sasToken);
});
