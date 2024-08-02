import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@ui/*': './src/lib/components/ui/*',
			'@base/*': './src/lib/components/base/*',
			'@utils/*': './src/lib/utils/*',
			'@modules/*': './src/lib/modules/*',
		},
	},
}

export default config
