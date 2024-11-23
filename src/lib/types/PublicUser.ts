import type { User } from '$lib/server/db/schema/user';

export type PublicUser = Pick<User, 'id' | 'username' | 'email' | 'picture'>;
