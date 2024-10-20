import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } }
};

export default config;
