import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		// Use NODE_ENV=production to ensure SvelteKit serves correct assets for E2E tests
		command: 'cross-env NODE_ENV=production npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	reporter: [['list'], ['html']],
	use: {
		trace: 'retain-on-failure',
		baseURL: 'http://localhost:4173'
	},
	testMatch: '**/**/*.e2e.ts',
	timeout: 30000
});
