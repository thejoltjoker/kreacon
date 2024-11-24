import env from '$lib/env';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

export const blobServiceClient = new BlobServiceClient(
	`https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
	new DefaultAzureCredential()
);

export const containerClient = blobServiceClient.getContainerClient(
	'kreacon-dev-storage-container'
);

// TODO
// export const uploadBlob = async (file: Buffer | Blob, contentType: string) => {
// 	let fileBuffer;
// 	if (file instanceof Blob) {
// 		fileBuffer = await file.arrayBuffer();
// 	} else {
// 		fileBuffer = file;
// 	}
// 	const blobName = createHash('sha256').update(fileBuffer).digest('hex');
// 	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// 	try {
// 		// Create a new block blob with the appropriate content type
// 		const options = {
// 			blobHTTPHeaders: {
// 				blobContentType: contentType
// 			}
// 		};
// 		const uploadBlobResponse = await blockBlobClient.upload(
// 			fileBuffer,
// 			fileBuffer.byteLength,
// 			options
// 		);
// 		console.log(`Uploaded block blob ${blobName} successfully`);

// 		// Return the blob URL for future reference
// 		return blockBlobClient.url;
// 	} catch (err: unknown) {
// 		console.error('Failed to upload blob:', err);
// 		throw err;
// 	}
// };

// Form
// const formData = await request.formData();
// const file = formData.get('photo') as File;
// const buffer = Buffer.from(await file.arrayBuffer());
// const imageUrl = await uploadBlob(buffer, file.type);

// Buffer
// const buffer = fs.readFileSync('path/to/photo.jpg');
// const imageUrl = await uploadBlob(buffer, 'image/jpeg');
