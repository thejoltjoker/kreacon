import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	reporter: [['list'], ['html']],
	use: {
		trace: 'retain-on-failure'
	},
	testMatch: '**/**/*.e2e.ts',
	timeout: 20000
});
