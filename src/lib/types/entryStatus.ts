export const entryStatus = [
	'draft',
	'pending',
	'published',
	'rejected',
	'deleted',
	'archived'
] as const;
export type EntryStatus = (typeof entryStatus)[number];
