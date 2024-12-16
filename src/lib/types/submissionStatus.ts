export const submissionStatus = [
	'draft',
	'pending',
	'published',
	'rejected',
	'deleted',
	'archived'
] as const;
export type SubmissionStatus = (typeof submissionStatus)[number];
