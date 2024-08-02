/** @typedef  {import("prettier").Config} PrettierConfig */

// @ts-expect-error SortImportsConfig missing
/** @type { PrettierConfig | SortImportsConfig } */
const config = {
	semi: false,
	useTabs: true,
	tabWidth: 3,
	proseWrap: 'always',
	printWidth: 80,
	arrowParens: 'always',
	singleQuote: true,
	trailingComma: 'all',
	importOrderTypeScriptVersion: '5.0.0',
	plugins: [
		'prettier-plugin-svelte',
		'@ianvs/prettier-plugin-sort-imports',
		// 'prettier-plugin-tailwindcss'
	],
	importOrder: [
		'<TYPES>^(node:)',
		'<TYPES>',
		'<TYPES>^[.]',
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'<THIRD_PARTY_MODULES>',
		'^(@ui|@base)(/.*)$',
		'^@/(.*)$'
	],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
}

module.exports = config
