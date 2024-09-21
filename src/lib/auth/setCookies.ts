import type { Cookies } from '@sveltejs/kit';

export const setCookies = (cookies: Cookies, accessToken: string, refreshToken: string) => {
	cookies.set('accessToken', accessToken, {
		httpOnly: true,
		secure: true,
		maxAge: 60 * 60, // 1 hour
		path: '/'
	});
	cookies.set('refreshToken', refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: '/'
	});
	return cookies;
};
