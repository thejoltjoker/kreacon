import { browser } from '$app/environment';
import { init, register, waitLocale } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('sv', () => import('./locales/sv-SE.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
	loadingDelay: 200
});

// Export a promise that resolves when the locale is loaded
export const i18nReady = new Promise((resolve) => {
	if (browser) {
		waitLocale().then(() => resolve(true));
	} else {
		resolve(true);
	}
});
