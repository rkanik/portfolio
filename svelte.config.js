import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './src/*',
			'@ui/*': './src/lib/components/ui/*',
			'@base/*': './src/lib/components/base/*',
			'@utils/*': './src/lib/utils/*',
			'@modules/*': './src/lib/modules/*',
			'@prisma/*': './prisma/*',
		},
	},
}

export default config
