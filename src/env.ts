import { defineEnvVars } from '@sveltejs/kit/env';
// TODO Implement actual schema validations
/**
 * Kit 3 environment variables. Server-side validation also runs via `#lib/env`.
 */
export const variables = defineEnvVars({
	// Public (browser-safe)
	PUBLIC_BASE_URL: {
		public: true,
		schema: (value) => value ?? ''
	},
	PUBLIC_MAX_UPLOAD_SIZE: {
		public: true,
		schema: (value) => {
			if (value === undefined || value === '') return String(10 * 1024 * 1024);
			return value;
		}
	},
	PUBLIC_SENTRY_DSN: {
		public: true,
		schema: (value) => value ?? ''
	},

	// Private
	AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING: {},
	AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS: {},
	OAUTH_GITHUB_CLIENT_ID: {
		schema: (value) => value ?? ''
	},
	OAUTH_GITHUB_CLIENT_SECRET: {
		schema: (value) => value ?? ''
	},
	OAUTH_GITHUB_REDIRECT_URI: {
		schema: (value) => value ?? ''
	},
	OAUTH_DISCORD_CLIENT_ID: {
		schema: (value) => value ?? ''
	},
	OAUTH_DISCORD_CLIENT_SECRET: {
		schema: (value) => value ?? ''
	},
	OAUTH_DISCORD_REDIRECT_URI: {
		schema: (value) => value ?? ''
	}
});
