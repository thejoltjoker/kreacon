import { browser } from '$app/environment';
import { toSnakeCase } from 'drizzle-orm/casing';
import { _, init, register, waitLocale } from 'svelte-i18n';
import { derived } from 'svelte/store';
import { defaultLocale, locales } from './locales';

for (const locale of Object.keys(locales)) {
	register(locale, locales[locale]);
}

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

// TODO Use runes
export const t = derived(
	_,
	($_): ((str: string) => string) =>
		(str: string) =>
			$_?.(toSnakeCase(str), { default: str })
);
