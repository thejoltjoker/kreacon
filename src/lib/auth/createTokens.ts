import { JWT_SIGNATURE } from '$env/static/private';
import type { AccessToken } from '$lib/types/AccessToken';
import type { RefreshToken } from '$lib/types/RefreshToken';
import jwt from 'jsonwebtoken';

export const createTokens = (sessionId: string, userId: string) => {
	const accessTokenPayload: AccessToken = {
		sessionId,
		userId
	};
	const refreshTokenPayload: RefreshToken = {
		sessionId
	};

	const refreshToken = jwt.sign(refreshTokenPayload, JWT_SIGNATURE);
	const accessToken = jwt.sign(accessTokenPayload, JWT_SIGNATURE);
	return { accessToken, refreshToken };
};
