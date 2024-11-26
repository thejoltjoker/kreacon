import type { UserWithoutPassword } from '$lib/server/db/schema/user';
import { writable } from 'svelte/store';

export const user = writable<UserWithoutPassword | null>(null);
