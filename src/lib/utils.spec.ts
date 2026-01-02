import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPublicUrl } from './utils';

// Mock SvelteKit environment modules
const mockEnv = {
	PUBLIC_BASE_URL: undefined as string | undefined
};

let mockDev = true;

vi.mock('$env/dynamic/public', () => ({
	get env() {
		return mockEnv;
	}
}));

vi.mock('$app/environment', () => ({
	get dev() {
		return mockDev;
	}
}));

describe('createPublicUrl', () => {
	beforeEach(() => {
		// Reset to default values before each test
		mockEnv.PUBLIC_BASE_URL = undefined;
		mockDev = true;
	});

	describe('basic URL construction', () => {
		it('should construct URL with default localhost in development', () => {
			mockEnv.PUBLIC_BASE_URL = undefined;
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://localhost:5173/api/test');
		});

		it('should construct URL with custom baseUrl in development', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should construct URL with custom baseUrl in production', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			mockDev = false;
			const result = createPublicUrl('/api/test');
			expect(result).toBe('https://example.com/api/test');
		});
	});

	describe('baseUrl sanitization', () => {
		it('should remove trailing slashes from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com/';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should remove multiple trailing slashes from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com///';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should remove http protocol from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'http://example.com';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should remove https protocol from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'https://example.com';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should remove protocol and trailing slashes from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'https://example.com/';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should strip path components from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com/api';
			const result = createPublicUrl('/test');
			expect(result).toBe('http://example.com/test');
		});

		it('should strip multiple path segments from baseUrl', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com/api/v1';
			const result = createPublicUrl('/test');
			expect(result).toBe('http://example.com/test');
		});

		it('should strip path components with protocol and trailing slash', () => {
			mockEnv.PUBLIC_BASE_URL = 'https://example.com/api/';
			const result = createPublicUrl('/test');
			expect(result).toBe('http://example.com/test');
		});

		it('should strip path components from production URL', () => {
			mockEnv.PUBLIC_BASE_URL = 'https://kreacon.beaconlan.se/api/';
			mockDev = false;
			const result = createPublicUrl('/uploads/get-url');
			expect(result).toBe('https://kreacon.beaconlan.se/uploads/get-url');
		});
	});

	describe('path sanitization', () => {
		it('should add leading slash to path if missing', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should preserve leading slash in path', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should handle root path', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/');
			expect(result).toBe('http://example.com/');
		});

		it('should handle nested paths', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/api/uploads/get-url');
			expect(result).toBe('http://example.com/api/uploads/get-url');
		});
	});

	describe('protocol selection', () => {
		it('should use http protocol in development', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			mockDev = true;
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://example.com/api/test');
		});

		it('should use https protocol in production', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			mockDev = false;
			const result = createPublicUrl('/api/test');
			expect(result).toBe('https://example.com/api/test');
		});
	});

	describe('error handling', () => {
		it('should handle empty baseUrl by using default', () => {
			mockEnv.PUBLIC_BASE_URL = '';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://localhost:5173/api/test');
		});
	});

	describe('real-world scenarios', () => {
		it('should handle production domain without protocol', () => {
			mockEnv.PUBLIC_BASE_URL = 'kreacon.beaconlan.se';
			mockDev = false;
			const result = createPublicUrl('/api/uploads/get-url');
			expect(result).toBe('https://kreacon.beaconlan.se/api/uploads/get-url');
		});

		it('should handle production domain with protocol and trailing slash', () => {
			mockEnv.PUBLIC_BASE_URL = 'https://kreacon.beaconlan.se/';
			mockDev = false;
			const result = createPublicUrl('/api/uploads/get-url');
			expect(result).toBe('https://kreacon.beaconlan.se/api/uploads/get-url');
		});

		it('should handle production domain with protocol and path component', () => {
			mockEnv.PUBLIC_BASE_URL = 'https://kreacon.beaconlan.se/api/';
			mockDev = false;
			const result = createPublicUrl('/uploads/get-url');
			expect(result).toBe('https://kreacon.beaconlan.se/uploads/get-url');
		});

		it('should handle localhost with port', () => {
			mockEnv.PUBLIC_BASE_URL = 'localhost:5173';
			const result = createPublicUrl('/api/test');
			expect(result).toBe('http://localhost:5173/api/test');
		});

		it('should handle subdomain', () => {
			mockEnv.PUBLIC_BASE_URL = 'api.example.com';
			const result = createPublicUrl('/v1/users');
			expect(result).toBe('http://api.example.com/v1/users');
		});
	});

	describe('URL validation', () => {
		it('should produce valid URLs', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/api/test');
			expect(() => new URL(result)).not.toThrow();
			expect(new URL(result).href).toBe(result);
		});

		it('should produce valid URLs with query parameters in path', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/api/test?param=value');
			expect(() => new URL(result)).not.toThrow();
		});

		it('should produce valid URLs with hash in path', () => {
			mockEnv.PUBLIC_BASE_URL = 'example.com';
			const result = createPublicUrl('/api/test#section');
			expect(() => new URL(result)).not.toThrow();
		});
	});
});
