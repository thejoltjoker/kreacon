export const azureStorageContainer = [
	'uploads',
	'video-submissions',
	'image-submissions',
	'audio-submissions',
	'avatar'
] as const;
export type AzureStorageContainer = (typeof azureStorageContainer)[number];
