import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter(),

		experimental: {
			tracing: {
				server: true
			},

			instrumentation: {
				server: true
			}
		}
	},

	extensions: ['.svelte', '.svx']
};
export default config;
// TODO Add polka for custom server https://www.npmjs.com/package/@polka/compression
