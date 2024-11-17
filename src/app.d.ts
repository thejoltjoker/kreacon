/// <reference types="svelte-adapter-azure-swa" />

import type { UserWithoutPassword } from '$lib/server/db/schema';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			user: UserWithoutPassword | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
