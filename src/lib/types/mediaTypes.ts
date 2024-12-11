export const mediaTypesWithMimeTypes = {
	image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'],
	video: ['video/mp4', 'video/quicktime', 'video/mpeg'],
	audio: ['audio/mpeg', 'audio/wav']
};

export const mimeTypes = Object.values(mediaTypesWithMimeTypes).flat();
export const mediaTypes = ['image', 'video', 'audio'] as const;
export type MediaType = (typeof mediaTypes)[number];
export type MimeType = (typeof mimeTypes)[number];
