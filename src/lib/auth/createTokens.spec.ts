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
		const sessionToken = 'test_session_token';
		const userId = 'test_user_id';

		// Act
		const { accessToken, refreshToken } = createTokens(sessionToken, userId);

		// Assert
		const decodedRefreshToken = jwt.verify(refreshToken, 'test_signature') as jwt.JwtPayload;
		const decodedAccessToken = jwt.verify(accessToken, 'test_signature') as jwt.JwtPayload;

		expect(decodedRefreshToken).toHaveProperty('sessionToken', sessionToken);
		expect(decodedAccessToken).toHaveProperty('sessionToken', sessionToken);
		expect(decodedAccessToken).toHaveProperty('userId', userId);
	});
});
