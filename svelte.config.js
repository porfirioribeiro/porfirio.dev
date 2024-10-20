import { sveltePreprocess } from 'svelte-preprocess';
import cloudflare from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [sveltePreprocess({})],

	kit: {
		adapter: cloudflare()
	}
};

export default config;
