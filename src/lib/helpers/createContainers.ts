import 'dotenv/config';
import {
	BlobServiceClient,
	StorageSharedKeyCredential,
	PublicAccessType
} from '@azure/storage-blob';

const ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const containers = [
	{ name: 'uploads', access: 'blob' as PublicAccessType },
	{ name: 'previews', access: 'blob' as PublicAccessType },
	{ name: 'thumbnails', access: 'blob' as PublicAccessType },
	{ name: 'avatars', access: 'blob' as PublicAccessType },
	{ name: 'video-entries', access: 'blob' as PublicAccessType },
	{ name: 'image-entries', access: 'blob' as PublicAccessType },
	{ name: 'audio-entries', access: 'blob' as PublicAccessType }
];

async function createContainers() {
	console.log('🔧 Creating Azure Storage Containers...\n');

	if (!ACCOUNT_NAME || !ACCOUNT_KEY) {
		console.error('❌ Missing AZURE_STORAGE_ACCOUNT_NAME or AZURE_STORAGE_ACCOUNT_KEY');
		process.exit(1);
	}

	const sharedKeyCredential = new StorageSharedKeyCredential(ACCOUNT_NAME, ACCOUNT_KEY);
	const blobServiceClient = new BlobServiceClient(
		`https://${ACCOUNT_NAME}.blob.core.windows.net`,
		sharedKeyCredential
	);

	for (const container of containers) {
		try {
			const containerClient = blobServiceClient.getContainerClient(container.name);
			const exists = await containerClient.exists();

			if (exists) {
				console.log(`✅ Container '${container.name}' already exists`);

				const props = await containerClient.getProperties();
				if (props.blobPublicAccess !== container.access) {
					await containerClient.setAccessPolicy(container.access);
					console.log(`   ↳ Updated public access to '${container.access}'`);
				} else {
					console.log(`   ↳ Public access: '${container.access}'`);
				}
			} else {
				await containerClient.create({ access: container.access });
				console.log(
					`✨ Created container '${container.name}' with public access '${container.access}'`
				);
			}
		} catch (err: any) {
			console.error(`❌ Failed to create/update container '${container.name}':`, err.message);
		}
	}

	console.log('\n✅ Container setup complete!');
}

createContainers().catch(console.error);
