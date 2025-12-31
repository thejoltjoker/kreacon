import { hash, verify } from 'argon2';
import env from '$lib/env';

export const argonSettings = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export const verifyPassword = async (hash: string, password: string) =>
	await verify(hash, password);

export const hashPassword = async (password: string) => await hash(password, argonSettings);

/**
 * Constructs a fully qualified public URL for a given path, based on NODE_ENV.
 * Server-side version that uses NODE_ENV instead of SvelteKit's dev constant.
 *
 * - Uses `https` protocol in production, otherwise `http` in development.
 * - Uses the `PUBLIC_BASE_URL` from environment variables as the base domain, or falls back to `localhost:5173` if unset.
 *
 * @param {string} path - The path to append to the base URL (should start with a slash, e.g., '/api/route').
 * @returns {string} The constructed absolute URL, e.g., 'https://example.com/api/route'
 */
export const createPublicUrl = (path: string): string => {
	const protocol = env.NODE_ENV === 'production' ? 'https' : 'http';
	const baseUrl = env.PUBLIC_BASE_URL || 'localhost:5173';
	const url = `${protocol}://${baseUrl}${path}`;
	return url;
};
