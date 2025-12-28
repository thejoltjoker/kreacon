import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: 'beacon-jc',
			project: 'javascript-sveltekit'
		}),
		tailwindcss(),
		sveltekit()
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
