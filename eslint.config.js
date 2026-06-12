import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			'svelte/no-at-html-tags': 'off',
			'svelte/valid-compile': 'off',
			// No base path configured — href links don't need resolve()
			'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }],
			// {#each} key is recommended but not required for static lists
			'svelte/require-each-key': 'warn'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '.beads/', '.claude/']
	}
];
