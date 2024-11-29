/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			slab: ['"Public Sans"', 'sans-serif']
		},
		extend: {
			// font
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			'light',
			'dark',
			'cupcake',
			'bumblebee',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'halloween',
			'garden',
			'forest',
			'aqua',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'black',
			'luxury',
			'dracula',
			'cmyk',
			'autumn',
			'business',
			'acid',
			'lemonade',
			'night',
			'coffee',
			'winter',
			'dim',
			'nord',
			'sunset',
			{
				teal: {
					[`primary`]: '#009688',
					[`primary-content`]: '#f3f4f6',
					[`secondary`]: '#0097A7',
					[`secondary-content`]: '#f3f4f6',
					[`accent`]: '#C2185B',
					[`accent-content`]: '#f3f4f6',
					[`neutral`]: '#009688',
					[`neutral-content`]: '#f3f4f6',
					[`base-100`]: '#212121',
					[`base-200`]: '#191919',
					[`base-300`]: '#0f0f0f',
					[`base-content`]: '#cdcdcd',
					[`info`]: '#60a5fa',
					[`info-content`]: '#000912',
					[`success`]: '#84cc16',
					[`success-content`]: '#091400',
					[`warning`]: '#f59e0b',
					[`warning-content`]: '#000',
					[`error`]: '#ef4444',
					[`error-content`]: '#160001'
				}
			}
		]
	}
}
