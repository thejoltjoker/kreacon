import type { MediaType } from '$lib/types/mediaTypes';

export const mimeFromMediaType = (mediaType: MediaType) => {
	if (mediaType === 'image') return 'image/png, image/jpeg, image/gif';
	if (mediaType === 'video')
		return 'video/mp4, video/mpeg, video/quicktime, video/H264, video/H265';
	if (mediaType === 'audio') return 'audio/mpeg, audio/wav';
};
