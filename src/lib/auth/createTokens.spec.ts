import { describe, it, expect, vi } from 'vitest';
import { createTokens } from './createTokens';
import * as jwt from 'jsonwebtoken';

// Remove the mock for jsonwebtoken
// vi.mock('jsonwebtoken');

vi.mock('$env/static/private', () => ({
	JWT_SIGNATURE: 'test_signature'
}));

describe('createTokens', () => {
	it('should create access and refresh tokens', () => {
		// Arrange
		const sessionId = 'test_session_id';
		const userId = 'test_user_id';

		// Act
		const { accessToken, refreshToken } = createTokens(sessionId, userId);

		// Assert
		const decodedRefreshToken = jwt.verify(refreshToken, 'test_signature') as jwt.JwtPayload;
		const decodedAccessToken = jwt.verify(accessToken, 'test_signature') as jwt.JwtPayload;

		expect(decodedRefreshToken).toHaveProperty('sessionId', sessionId);
		expect(decodedAccessToken).toHaveProperty('sessionId', sessionId);
		expect(decodedAccessToken).toHaveProperty('userId', userId);
	});
});
