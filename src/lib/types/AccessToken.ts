import type { JwtPayload } from 'jsonwebtoken';

export type AccessToken = {
	sessionToken: string;
	userId: string;
} & JwtPayload;
