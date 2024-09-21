import type { JwtPayload } from 'jsonwebtoken';

export type RefreshToken = {
	sessionToken: string;
} & JwtPayload;
