export const submissionStatus = ['draft', 'pending', 'published', 'hidden', 'deleted'] as const;
export type SubmissionStatus = (typeof submissionStatus)[number];
