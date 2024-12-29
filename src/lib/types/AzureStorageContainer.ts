export const azureStorageContainer = [
	'uploads',
	'video-entries',
	'image-entries',
	'audio-entries',
	'avatar',
	'thumbnails'
] as const;
export type AzureStorageContainer = (typeof azureStorageContainer)[number];
