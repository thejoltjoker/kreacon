import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: 'beacon-jc',
			project: 'javascript-sveltekit',
			// Skip release upload in CI/e2e when no auth token is configured
			autoUploadSourceMaps: Boolean(process.env.SENTRY_AUTH_TOKEN)
		}),
		tailwindcss(),
		sveltekit()
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
