import type { User } from '$lib/server/db/schema';

export type PublicUser = Pick<User, 'id' | 'username' | 'email' | 'image'>;
