import { mediaTypesWithMimeTypes, mimeTypes, type MediaType } from '$lib/types/mediaTypes';
import mime from 'mime/lite';

export const isValidMimeType = (mimeType: string) => {
	const extension = mime.getExtension(mimeType);
	if (!extension) {
		return false;
	}
	return true;
};

export const isValidMediaType = (mediaType: string): boolean =>
	Object.keys(mediaTypesWithMimeTypes).includes(mediaType);

export const isAllowedMimeType = (mimeType: string): boolean => mimeTypes.includes(mimeType);

export const getAllowedMimeTypes = (mediaType: MediaType): string[] =>
	mediaTypesWithMimeTypes[mediaType];

export const getAllowedExtensions = (mediaType: MediaType): string[] => {
	const mimeTypes = getAllowedMimeTypes(mediaType);
	const extensions = new Set<string>();
	for (const mimeType of mimeTypes) {
		const exts = mime.getAllExtensions(mimeType) ?? [];
		exts.forEach((ext) => extensions.add(ext));
	}
	return Array.from(extensions);
};
