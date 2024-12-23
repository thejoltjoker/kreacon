import { z } from 'zod';

export const licenseCode = [
	'cc-by',
	'cc-by-sa',
	'cc-by-nc',
	'cc-by-nc-sa',
	'cc-by-nd',
	'cc-by-nc-nd',
	'cc0'
] as const;
export type LicenseCode = (typeof licenseCode)[number];

export const licenseEnum = z.enum(licenseCode);

export const licenseSchema = z.object({
	code: licenseEnum,
	url: z.string().url()
});

export type License = z.infer<typeof licenseSchema>;

export const licenses = {
	ccBy: licenseSchema.parse({
		code: 'cc-by',
		url: 'https://creativecommons.org/licenses/by/4.0/'
	}),
	ccBySa: licenseSchema.parse({
		code: 'cc-by-sa',
		url: 'https://creativecommons.org/licenses/by-sa/4.0/'
	}),
	ccByNc: licenseSchema.parse({
		code: 'cc-by-nc',
		url: 'https://creativecommons.org/licenses/by-nc/4.0/'
	}),
	ccByNcSa: licenseSchema.parse({
		code: 'cc-by-nc-sa',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
	}),
	ccByNd: licenseSchema.parse({
		code: 'cc-by-nd',
		url: 'https://creativecommons.org/licenses/by-nd/4.0/'
	}),
	ccByNcNd: licenseSchema.parse({
		code: 'cc-by-nc-nd',
		url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
	}),
	cc0: licenseSchema.parse({
		code: 'cc0',
		url: 'https://creativecommons.org/publicdomain/zero/1.0/'
	})
} as const;
