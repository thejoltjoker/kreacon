import { JWT_SIGNATURE } from '$env/static/private';
import type { AccessToken } from '$lib/types/AccessToken';
import type { RefreshToken } from '$lib/types/RefreshToken';
import jwt from 'jsonwebtoken';

export const createTokens = (sessionToken: string, userId: string) => {
	const accessTokenPayload: AccessToken = {
		sessionToken,
		userId
	};
	const refreshTokenPayload: RefreshToken = {
		sessionToken: sessionToken
	};

	const refreshToken = jwt.sign(refreshTokenPayload, JWT_SIGNATURE);
	const accessToken = jwt.sign(accessTokenPayload, JWT_SIGNATURE);
	return { accessToken, refreshToken };
};
