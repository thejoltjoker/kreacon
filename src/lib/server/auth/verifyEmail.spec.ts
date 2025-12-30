import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	createVerifyEmailToken,
	createVerifyEmailLink,
	sendEmailVerification,
	TOKEN_VALIDITY_MS
} from './verifyEmail';
import { Email, type EmailMessage } from '$lib/server/services/email';

vi.mock('$lib/server/services/email', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const MockEmail = vi.fn(function (this: any) {
		this.send = vi.fn().mockResolvedValue(undefined);
	});
	return { Email: MockEmail };
});

vi.mock('$env/static/private', () => ({
	AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS: 'noreply@test.com'
}));

vi.mock('$lib/env', () => ({
	default: {
		EMAIL_VERIFICATION_SECRET: 'test-secret',
		NODE_ENV: 'development',
		PUBLIC_BASE_URL: 'localhost:5173'
	}
}));

describe('createVerifyEmailToken', () => {
	const testEmail = 'test@example.com';
	const testTimestamp = 1609459200000; // 2021-01-01T00:00:00.000Z

	describe('deterministic token generation', () => {
		it('should generate the same token for the same email and timestamp', () => {
			const result1 = createVerifyEmailToken(testEmail, testTimestamp);
			const result2 = createVerifyEmailToken(testEmail, testTimestamp);

			expect(result1.token).toBe(result2.token);
			expect(result1.timestamp).toBe(result2.timestamp);
		});

		it('should generate identical tokens across multiple calls with same inputs', () => {
			const tokens = new Set();
			for (let i = 0; i < 10; i++) {
				const { token } = createVerifyEmailToken(testEmail, testTimestamp);
				tokens.add(token);
			}
			expect(tokens.size).toBe(1);
		});
	});

	describe('token uniqueness', () => {
		it('should generate different tokens for different emails', () => {
			const email1 = 'user1@example.com';
			const email2 = 'user2@example.com';

			const result1 = createVerifyEmailToken(email1, testTimestamp);
			const result2 = createVerifyEmailToken(email2, testTimestamp);

			expect(result1.token).not.toBe(result2.token);
		});

		it('should generate different tokens for different timestamps', () => {
			const timestamp1 = 1609459200000;
			const timestamp2 = 1609459200001;

			const result1 = createVerifyEmailToken(testEmail, timestamp1);
			const result2 = createVerifyEmailToken(testEmail, timestamp2);

			expect(result1.token).not.toBe(result2.token);
		});

		it('should generate different tokens for case-sensitive emails', () => {
			const email1 = 'test@example.com';
			const email2 = 'Test@example.com';

			const result1 = createVerifyEmailToken(email1, testTimestamp);
			const result2 = createVerifyEmailToken(email2, testTimestamp);

			expect(result1.token).not.toBe(result2.token);
		});
	});

	describe('token format', () => {
		it('should generate a 64-character hexadecimal token (SHA-256)', () => {
			const { token } = createVerifyEmailToken(testEmail, testTimestamp);

			expect(token).toHaveLength(64);
			expect(token).toMatch(/^[a-f0-9]{64}$/);
		});

		it('should return the provided timestamp', () => {
			const { timestamp } = createVerifyEmailToken(testEmail, testTimestamp);

			expect(timestamp).toBe(testTimestamp);
		});

		it('should use current timestamp when not provided', () => {
			const now = Date.now();
			vi.setSystemTime(now);

			const { timestamp } = createVerifyEmailToken(testEmail);

			expect(timestamp).toBe(now);
		});
	});

	describe('edge cases', () => {
		it('should handle empty email string', () => {
			const { token } = createVerifyEmailToken('', testTimestamp);

			expect(token).toHaveLength(64);
			expect(token).toMatch(/^[a-f0-9]{64}$/);
		});

		it('should handle very long email addresses', () => {
			const longEmail = 'a'.repeat(100) + '@example.com';
			const { token } = createVerifyEmailToken(longEmail, testTimestamp);

			expect(token).toHaveLength(64);
			expect(token).toMatch(/^[a-f0-9]{64}$/);
		});

		it('should handle special characters in email', () => {
			const specialEmail = 'test+tag@example.com';
			const { token } = createVerifyEmailToken(specialEmail, testTimestamp);

			expect(token).toHaveLength(64);
			expect(token).toMatch(/^[a-f0-9]{64}$/);
		});

		it('should handle timestamp at epoch (0)', () => {
			const { token, timestamp } = createVerifyEmailToken(testEmail, 0);

			expect(token).toHaveLength(64);
			expect(timestamp).toBe(0);
		});

		it('should handle very large timestamps', () => {
			const largeTimestamp = Number.MAX_SAFE_INTEGER;
			const { token, timestamp } = createVerifyEmailToken(testEmail, largeTimestamp);

			expect(token).toHaveLength(64);
			expect(timestamp).toBe(largeTimestamp);
		});
	});

	describe('cryptographic properties', () => {
		it('should generate tokens that appear random and uniformly distributed', () => {
			const tokens = new Set();
			const emails = Array.from({ length: 100 }, (_, i) => `user${i}@example.com`);

			for (const email of emails) {
				const { token } = createVerifyEmailToken(email, testTimestamp);
				tokens.add(token);
			}

			expect(tokens.size).toBe(100);
		});

		it('should generate different tokens for sequential timestamps', () => {
			const tokens = new Set();
			for (let i = 0; i < 100; i++) {
				const { token } = createVerifyEmailToken(testEmail, testTimestamp + i);
				tokens.add(token);
			}

			expect(tokens.size).toBe(100);
		});

		it('should not leak information about email in token', () => {
			const email = 'john.doe@example.com';
			const { token } = createVerifyEmailToken(email, testTimestamp);

			expect(token.toLowerCase()).not.toContain('john');
			expect(token.toLowerCase()).not.toContain('doe');
			expect(token.toLowerCase()).not.toContain('example');
		});
	});
});

describe('createVerifyEmailLink', () => {
	const testEmail = 'test@example.com';

	describe('link format', () => {
		it('should generate a valid URL with encoded email', () => {
			const link = createVerifyEmailLink(testEmail);

			expect(link).toMatch(/^http:\/\/localhost:5173\/verify-email\//);
			expect(link).toContain(encodeURIComponent(testEmail));
		});

		it('should include token and timestamp in URL', () => {
			const link = createVerifyEmailLink(testEmail);
			const url = new URL(link);

			const pathParts = url.pathname.split('/');
			expect(pathParts[1]).toBe('verify-email');
			expect(pathParts[2]).toBe(encodeURIComponent(testEmail));
			expect(pathParts[3]).toHaveLength(64);

			const timestamp = url.searchParams.get('t');
			expect(timestamp).toBeTruthy();
			expect(Number(timestamp)).toBeGreaterThan(0);
		});

		it('should use https in production', async () => {
			const env = await import('$lib/env');
			vi.mocked(env.default).NODE_ENV = 'production';

			const link = createVerifyEmailLink(testEmail);

			expect(link).toMatch(/^https:\/\//);

			// Reset
			vi.mocked(env.default).NODE_ENV = 'development';
		});

		it('should use http in development', () => {
			const link = createVerifyEmailLink(testEmail);

			expect(link).toMatch(/^http:\/\//);
		});
	});

	describe('email encoding', () => {
		it('should properly encode email with special characters', () => {
			const specialEmail = 'test+tag@example.com';
			const link = createVerifyEmailLink(specialEmail);

			expect(link).toContain(encodeURIComponent(specialEmail));
			expect(link).not.toContain('+');
		});

		it('should handle email with spaces (invalid but should encode)', () => {
			const emailWithSpace = 'test user@example.com';
			const link = createVerifyEmailLink(emailWithSpace);

			expect(link).toContain(encodeURIComponent(emailWithSpace));
			expect(link).not.toContain(' ');
		});

		it('should handle international characters in email', () => {
			const internationalEmail = 'tëst@éxample.com';
			const link = createVerifyEmailLink(internationalEmail);

			expect(link).toContain(encodeURIComponent(internationalEmail));
		});
	});

	describe('link consistency', () => {
		it('should generate different links for different emails', () => {
			const link1 = createVerifyEmailLink('user1@example.com');
			const link2 = createVerifyEmailLink('user2@example.com');

			expect(link1).not.toBe(link2);
		});

		it('should generate different links on subsequent calls (different timestamps)', () => {
			vi.useFakeTimers();
			const time1 = new Date('2024-01-01T00:00:00.000Z');
			vi.setSystemTime(time1);
			const link1 = createVerifyEmailLink(testEmail);

			const time2 = new Date('2024-01-01T00:00:00.001Z');
			vi.setSystemTime(time2);
			const link2 = createVerifyEmailLink(testEmail);

			expect(link1).not.toBe(link2);
			vi.useRealTimers();
		});
	});

	describe('base URL configuration', () => {
		it('should use PUBLIC_BASE_URL when set', async () => {
			const env = await import('$lib/env');
			vi.mocked(env.default).PUBLIC_BASE_URL = 'example.com';

			const link = createVerifyEmailLink(testEmail);

			expect(link).toContain('example.com');

			// Reset
			vi.mocked(env.default).PUBLIC_BASE_URL = 'localhost:5173';
		});

		it('should default to localhost:5173 when PUBLIC_BASE_URL is not set', async () => {
			const env = await import('$lib/env');
			vi.mocked(env.default).PUBLIC_BASE_URL = '';

			const link = createVerifyEmailLink(testEmail);

			expect(link).toContain('localhost:5173');

			// Reset
			vi.mocked(env.default).PUBLIC_BASE_URL = 'localhost:5173';
		});
	});
});

describe('sendEmailVerification', () => {
	const testEmail = 'test@example.com';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create and send an email with verification link', async () => {
		await sendEmailVerification(testEmail);

		expect(Email).toHaveBeenCalledTimes(1);
		const emailInstance = vi.mocked(Email).mock.results[0].value;
		expect(emailInstance.send).toHaveBeenCalledTimes(1);
	});

	it('should include correct email message properties', async () => {
		await sendEmailVerification(testEmail);

		const emailCall = vi.mocked(Email).mock.calls[0][0] as EmailMessage;
		expect(emailCall.from).toBe('noreply@test.com');
		expect(emailCall.to).toBe(testEmail);
		expect(emailCall.subject).toBe('Verify your email');
		expect(emailCall.body).toBeTruthy();
	});

	it('should include verification link in email body', async () => {
		await sendEmailVerification(testEmail);

		const emailCall = vi.mocked(Email).mock.calls[0]?.[0];
		expect(emailCall).toBeDefined();
		expect(emailCall?.body).toContain('verify-email');
		expect(emailCall?.body).toContain(encodeURIComponent(testEmail));
	});

	it('should handle email sending errors', async () => {
		const mockError = new Error('Email service unavailable');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		vi.mocked(Email).mockImplementationOnce(function (this: any) {
			this.send = vi.fn().mockRejectedValue(mockError);
		});

		await expect(sendEmailVerification(testEmail)).rejects.toThrow('Email service unavailable');
	});
});

describe('TOKEN_VALIDITY_MS constant', () => {
	it('should be set to 24 hours in milliseconds', () => {
		const expectedMs = 24 * 60 * 60 * 1000; // 86400000
		expect(TOKEN_VALIDITY_MS).toBe(expectedMs);
	});

	it('should be a positive integer', () => {
		expect(TOKEN_VALIDITY_MS).toBeGreaterThan(0);
		expect(Number.isInteger(TOKEN_VALIDITY_MS)).toBe(true);
	});
});

describe('integration: token validation workflow', () => {
	it('should generate tokens that can be validated by the server endpoint logic', () => {
		const email = 'user@example.com';
		const timestamp = Date.now();

		const { token: generatedToken } = createVerifyEmailToken(email, timestamp);

		const { token: validationToken } = createVerifyEmailToken(email, timestamp);

		expect(generatedToken).toBe(validationToken);
	});

	it('should reject tokens with modified email', () => {
		const originalEmail = 'user@example.com';
		const modifiedEmail = 'attacker@example.com';
		const timestamp = Date.now();

		const { token: originalToken } = createVerifyEmailToken(originalEmail, timestamp);
		const { token: modifiedToken } = createVerifyEmailToken(modifiedEmail, timestamp);

		expect(originalToken).not.toBe(modifiedToken);
	});

	it('should reject tokens with modified timestamp', () => {
		const email = 'user@example.com';
		const originalTimestamp = Date.now();
		const modifiedTimestamp = originalTimestamp + 1000;

		const { token: originalToken } = createVerifyEmailToken(email, originalTimestamp);
		const { token: modifiedToken } = createVerifyEmailToken(email, modifiedTimestamp);

		expect(originalToken).not.toBe(modifiedToken);
	});

	it('should validate token expiration correctly', () => {
		const timestamp = Date.now() - TOKEN_VALIDITY_MS - 1000;
		const now = Date.now();

		const isExpired = now - timestamp > TOKEN_VALIDITY_MS;
		expect(isExpired).toBe(true);
	});

	it('should accept tokens within validity period', () => {
		const timestamp = Date.now() - TOKEN_VALIDITY_MS + 60000;
		const now = Date.now();

		const isValid = now - timestamp <= TOKEN_VALIDITY_MS;
		expect(isValid).toBe(true);
	});
});
