import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: process.env.SENTRY_ORG ?? 'beacon-jc',
			project: process.env.SENTRY_PROJECT ?? 'javascript-sveltekit'
		}),
		tailwindcss(),
		sveltekit()
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
