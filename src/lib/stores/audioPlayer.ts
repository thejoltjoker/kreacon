import { writable } from 'svelte/store';

export const audioPlayer = writable();
export const status = writable('default');
export const isPlaying = writable(false);
export const index = writable(0);
