import { JWT_SIGNATURE } from '$env/static/private';
import type { AccessToken } from '$lib/types/AccessToken';
import type { RequestEvent } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const authenticate = async (event: RequestEvent): Promise<AccessToken | null> => {
	const accessToken = event.cookies.get('accessToken');

	if (!accessToken) {
		return null;
	}

	const payload = jwt.verify(accessToken, JWT_SIGNATURE) as AccessToken;
	return payload;
};
