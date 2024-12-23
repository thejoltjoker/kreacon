export const MediaTypes = ['image', 'video', 'audio', 'archive'] as const;

export const MimeTypeMap = {
	image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'],
	video: ['video/mp4', 'video/quicktime', 'video/mpeg'],
	audio: ['audio/mpeg', 'audio/wav'],
	archive: ['application/zip', 'application/x-7z-compressed', 'application/x-rar-compressed']
} as const;

export const ExtensionMap = {
	image: ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'webp'],
	video: ['mp4', 'mov', 'mpg', 'mpeg'],
	audio: ['mp3', 'wav'],
	archive: ['zip', '7z', 'rar']
} as const;

export type MediaType = (typeof MediaTypes)[number];
export type MimeType = (typeof MimeTypeMap)[MediaType][number];
