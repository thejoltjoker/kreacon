import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Constructs a fully qualified public URL for a given path, based on app environment.
 *
 * - Uses `https` protocol in production, otherwise `http` in development.
 * - Uses the `PUBLIC_BASE_URL` from environment variables as the base domain, or falls back to `localhost:5173` if unset.
 * - Properly handles baseUrl with or without protocol/trailing slashes.
 *
 * @param {string} path - The path to append to the base URL (should start with a slash, e.g., '/api/route').
 * @returns {string} The constructed absolute URL, e.g., 'https://example.com/api/route'
 */
export const createPublicUrl = (path: string): string => {
	let baseUrl = env.PUBLIC_BASE_URL || 'localhost:5173';
	baseUrl = baseUrl.replace(/\/+$/, '');
	baseUrl = baseUrl.replace(/^https?:\/\//, '');

	if (!path.startsWith('/')) {
		path = '/' + path;
	}

	const protocol = dev ? 'http' : 'https';

	const url = new URL(path, `${protocol}://${baseUrl}`);

	return url.toString();
};
