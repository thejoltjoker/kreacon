import { writable } from 'svelte/store';

const createUserStore = () => {
	const { subscribe, set } = writable<UserWithoutPassword | null>(null);

	return {
		subscribe,
		set,
		reset: () => set(null)
	};
};

export const user = createUserStore();
