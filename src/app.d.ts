/// <reference types="svelte-adapter-azure-swa" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			user: Omit<User, 'password'> | null;
		}
		interface PageData {
			user: Omit<User, 'password'> | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
