export const azureStorageContainer = [
	'uploads',
	'video-entries',
	'image-entries',
	'audio-entries',
	'avatars',
	'thumbnails',
	'previews',
	'proofs'
] as const;
export type AzureStorageContainer = (typeof azureStorageContainer)[number];
