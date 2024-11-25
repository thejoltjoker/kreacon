/// <reference types="svelte-adapter-azure-swa" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
