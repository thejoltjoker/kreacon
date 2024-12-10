import { mediaTypes, mediaTypesWithMimeTypes, mimeTypes } from '$lib/types/mediaTypes';
import mime from 'mime/lite';

export const isValidMimeType = (mimeType: string) => {
	const extension = mime.getExtension(mimeType);
	if (!extension) {
		return false;
	}
	return true;
};

export const isValidMediaType = (mediaType: string) =>
	Object.keys(mediaTypesWithMimeTypes).includes(mediaType);

export const isAllowedMimeType = (mimeType: string) => mimeTypes.includes(mimeType);
