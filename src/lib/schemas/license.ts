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
export const termsSchema = z.object({
	title: z.string(),
	text: z.string()
});
export type Term = z.infer<typeof termsSchema>;
export const licenseSchema = z.object({
	code: licenseEnum,
	url: z.string().url(),
	allowed: z.array(termsSchema),
	terms: z.array(termsSchema),
	notices: z.array(z.string())
});

export type License = z.infer<typeof licenseSchema>;

export const allowed: Record<string, Term> = {
	share: {
		title: 'Share',
		text: 'Copy and redistribute the material in any medium or format.'
	},
	adapt: {
		title: 'Adapt',
		text: 'Remix, transform, and build upon the material.'
	}
};

export const terms: Record<string, Term> = {
	attribution: {
		title: 'Attribution',
		text: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.'
	},
	noAdditionalRestrictions: {
		title: 'No additional restrictions',
		text: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
	},
	shareAlike: {
		title: 'ShareAlike',
		text: 'If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.'
	},
	nonCommercial: {
		title: 'NonCommercial',
		text: 'You may not use the material for commercial purposes.'
	}
};

// Common notices
const publicDomainNotice =
	'You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.';
const noWarrantiesNotice =
	'No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.';

export const licenses: Record<LicenseCode, License> = {
	'cc-by': licenseSchema.parse({
		code: 'cc-by',
		url: 'https://creativecommons.org/licenses/by/4.0/',
		allowed: [allowed.share, allowed.adapt],
		terms: [terms.attribution, terms.noAdditionalRestrictions],
		notices: [publicDomainNotice, noWarrantiesNotice]
	}),
	'cc-by-sa': licenseSchema.parse({
		code: 'cc-by-sa',
		url: 'https://creativecommons.org/licenses/by-sa/4.0/',
		allowed: [allowed.share, allowed.adapt],
		terms: [terms.attribution, terms.shareAlike, terms.noAdditionalRestrictions],
		notices: [publicDomainNotice, noWarrantiesNotice]
	}),
	'cc-by-nc': licenseSchema.parse({
		code: 'cc-by-nc',
		url: 'https://creativecommons.org/licenses/by-nc/4.0/',
		allowed: [allowed.share, allowed.adapt],
		terms: [terms.attribution, terms.nonCommercial, terms.noAdditionalRestrictions],
		notices: [publicDomainNotice, noWarrantiesNotice]
	}),
	'cc-by-nc-sa': licenseSchema.parse({
		code: 'cc-by-nc-sa',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
		allowed: [allowed.share, allowed.adapt],
		terms: [
			terms.attribution,
			terms.nonCommercial,
			terms.shareAlike,
			terms.noAdditionalRestrictions
		],
		notices: [publicDomainNotice, noWarrantiesNotice]
	}),
	'cc-by-nd': licenseSchema.parse({
		code: 'cc-by-nd',
		url: 'https://creativecommons.org/licenses/by-nd/4.0/',
		allowed: [
			{
				title: 'Share',
				text: 'Copy and redistribute the material in any medium or format for any purpose, even commercially.'
			}
		],
		terms: [
			terms.attribution,
			{
				title: 'NoDerivatives',
				text: 'If you remix, transform, or build upon the material, you may not distribute the modified material.'
			},
			terms.noAdditionalRestrictions
		],
		notices: [publicDomainNotice, noWarrantiesNotice]
	}),
	'cc-by-nc-nd': licenseSchema.parse({
		code: 'cc-by-nc-nd',
		url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
		allowed: [allowed.share],
		terms: [
			terms.attribution,
			terms.nonCommercial,
			{
				title: 'NoDerivatives',
				text: 'If you remix, transform, or build upon the material, you may not distribute the modified material.'
			},
			terms.noAdditionalRestrictions
		],
		notices: [publicDomainNotice, noWarrantiesNotice]
	}),
	cc0: licenseSchema.parse({
		code: 'cc0',
		url: 'https://creativecommons.org/publicdomain/zero/1.0/',
		allowed: [
			{
				title: 'Public Domain Dedication',
				text: 'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.'
			}
		],
		terms: [
			{
				title: 'No Copyright',
				text: 'You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.'
			}
		],
		notices: [
			'In no way are the patent or trademark rights of any person affected by CC0, nor are the rights that other persons may have in the work or in how the work is used, such as publicity or privacy rights.',
			'Unless expressly stated otherwise, the person who associated a work with this deed makes no warranties about the work, and disclaims liability for all uses of the work, to the fullest extent permitted by applicable law.',
			'When using or citing the work, you should not imply endorsement by the author or the affirmer.'
		]
	})
} as const;
