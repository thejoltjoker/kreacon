import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sentrySvelteKit } from '@sentry/sveltekit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
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
		sveltekit({
			preprocess: [vitePreprocess(), mdsvex()],
			extensions: ['.svelte', '.svx'],
			adapter: adapter(),
			tracing: {
				server: true
			}
		})
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
