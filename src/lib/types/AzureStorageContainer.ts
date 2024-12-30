export const azureStorageContainer = [
	'uploads',
	'video-entries',
	'image-entries',
	'audio-entries',
	'avatars',
	'thumbnails',
	'previews'
] as const;
export type AzureStorageContainer = (typeof azureStorageContainer)[number];
