export const MediaTypes = ['image', 'video', 'audio'] as const;

export const MimeTypeMap = {
	image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'],
	video: ['video/mp4', 'video/quicktime', 'video/mpeg'],
	audio: ['audio/mpeg', 'audio/wav']
} as const;

export const ExtensionMap = {
	image: ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'webp'],
	video: ['mp4', 'mov', 'mpg', 'mpeg'],
	audio: ['mp3', 'wav']
} as const;

export type MediaType = (typeof MediaTypes)[number];
export type MimeType = (typeof MimeTypeMap)[MediaType][number];
