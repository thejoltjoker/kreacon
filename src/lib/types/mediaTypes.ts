export const mediaTypes = ['image', 'video', 'audio'] as const;
export type MediaType = (typeof mediaTypes)[number];
