import type { JwtPayload } from 'jsonwebtoken';

export type AccessToken = {
	sessionId: string;
	userId: string;
} & JwtPayload;
