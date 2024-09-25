import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

export const setCookies = (
	cookies: Cookies,
	accessToken: string,
	refreshToken: string,
	expiresAt: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
	accessTokenMaxAge: number = 60 * 10 // 10 minutes
) => {
	cookies.set('accessToken', accessToken, {
		httpOnly: true,
		secure: dev ?? true,
		maxAge: accessTokenMaxAge,
		path: '/'
	});
	cookies.set('refreshToken', refreshToken, {
		httpOnly: true,
		secure: dev ?? true,
		expires: expiresAt,
		path: '/'
	});
	return cookies;
};
