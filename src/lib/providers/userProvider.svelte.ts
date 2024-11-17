import type { UserWithoutPassword } from '$lib/server/db/schema/user';

export function createUserProvider() {
	let user = $state<UserWithoutPassword | null>(null);

	return {
		get user() {
			return user;
		},
		set user(userData: UserWithoutPassword) {
			user = userData;
		}
	};
}

export const userProvider = createUserProvider();
