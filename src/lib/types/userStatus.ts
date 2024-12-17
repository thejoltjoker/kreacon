export const userStatus = ['active', 'banned'] as const;
export type UserStatus = (typeof userStatus)[number];
