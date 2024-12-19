export const MediaTypes = ['image', 'video', 'audio'] as const;

export const MimeTypeMap = {
	image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'],
	video: ['video/mp4', 'video/quicktime', 'video/mpeg'],
	audio: ['audio/mpeg', 'audio/wav']
} as const;

export type MediaType = (typeof MediaTypes)[number];
export type MimeType = (typeof MimeTypeMap)[MediaType][number];

export const getAllMimeTypes = () => Object.values(MimeTypeMap).flat();
export const getMimeTypesForMedia = (mediaType: MediaType) => MimeTypeMap[mediaType];
