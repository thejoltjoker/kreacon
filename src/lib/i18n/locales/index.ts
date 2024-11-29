export const defaultLocale = 'en';
export const locales = {
	en: () => import('./en.json'),
	sv: () => import('./sv.json')
};
