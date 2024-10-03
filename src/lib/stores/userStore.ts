import type { PublicUser } from '$lib/types/PublicUser';
import { writable } from 'svelte/store';

export const userStore = writable<PublicUser | null>(null);
