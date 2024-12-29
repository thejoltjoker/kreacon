import mime from 'mime/lite';
import {
	ExtensionMap,
	MimeTypeMap,
	MediaTypes,
	type MediaType,
	type MimeType
} from '../types/mediaTypes';

export const getAllMimeTypes = () => Object.values(MimeTypeMap).flat();
export const getMimeTypesForMedia = (mediaType: MediaType) => [...MimeTypeMap[mediaType]];
export const getMediaTypeForMime = (mimeType: string) => {
	for (const mediaType of MediaTypes) {
		if ([...MimeTypeMap[mediaType]].includes(mimeType as MimeType)) {
			return mediaType;
		}
	}
	return null;
};
export const getExtensionsForMedia = (mediaType: MediaType) => [...ExtensionMap[mediaType]];

export const isValidMimeType = (mimeType: string) => {
	const extension = mime.getExtension(mimeType);
	if (!extension) {
		return false;
	}
	return true;
};

export const isValidMediaType = (mediaType: string): boolean =>
	MediaTypes.includes(mediaType as MediaType);

export const isAllowedMimeType = (mimeType: string): boolean =>
	Array.from(getAllMimeTypes()).includes(mimeType as MimeType);

export const getAllowedMimeTypes = (mediaType: MediaType): string[] =>
	Array.from(getMimeTypesForMedia(mediaType));

export const getAllowedExtensions = (mediaType: MediaType): string[] => {
	const mimeTypes = getAllowedMimeTypes(mediaType);
	const extensions = new Set<string>();
	for (const mimeType of mimeTypes) {
		const exts = mime.getAllExtensions(mimeType) ?? [];
		exts.forEach((ext) => extensions.add(ext));
	}
	return Array.from(extensions);
};

export const getAllExtensions = (mimeType: MimeType) => {
	const extensions = new Set<string>();
	const exts = mime.getAllExtensions(mimeType) ?? [];
	exts.forEach((ext) => extensions.add(ext));
	return Array.from(extensions);
};
