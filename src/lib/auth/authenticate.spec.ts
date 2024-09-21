import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { authenticate } from './authenticate';
import * as jwt from 'jsonwebtoken';
import type { RequestEvent } from '@sveltejs/kit';

describe('authenticate', () => {
	const testSecret = 'test-secret';
	const testPayload = { userId: '123', username: 'testuser' };
	let validToken: string;

	beforeAll(() => {
		process.env.JWT_SECRET = testSecret;
		validToken = jwt.sign(testPayload, testSecret);
	});

	afterAll(() => {
		delete process.env.JWT_SECRET;
	});

	it('should return null if no accessToken is present', async () => {
		const mockEvent = {
			cookies: {
				get: () => null
			}
		};

		const result = await authenticate(mockEvent as unknown as RequestEvent);
		expect(result).toBeNull();
	});

	it('should return the decoded token payload if a valid token is present', async () => {
		const mockEvent = {
			cookies: {
				get: () => validToken
			}
		};

		const result = await authenticate(mockEvent as unknown as RequestEvent);
		expect(result).toEqual(testPayload);
	});

	it('should throw an error if the token is invalid', async () => {
		const invalidToken = 'invalid.token.here';
		const mockEvent = {
			cookies: {
				get: () => invalidToken
			}
		};

		await expect(authenticate(mockEvent as unknown as RequestEvent)).rejects.toThrow(
			jwt.JsonWebTokenError
		);
	});
});
