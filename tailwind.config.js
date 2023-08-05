/** @type {import('tailwindcss').Config} */
export default {
	plugins: [require('daisyui')],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			slab: ['"Public Sans"', 'sans-serif']
		},
		extend: {
			// font
		}
	},
	daisyui: {
		themes: [
			{
				neutral: {
					[`primary`]: '#be185d',
					// [`primary-focus`]: '#be185d',
					[`primary-content`]: '#F1F1F1',
					[`secondary`]: '#0d9488',
					// [`secondary-focus`]: '',
					[`secondary-content`]: '#98F2EB',
					[`accent`]: '#1FB2A5',
					// [`accent-focus`]: '',
					[`accent-content`]: '#004F49',
					[`neutral`]: '#0F0F0F',
					[`neutral-focus`]: '#272727',
					[`neutral-content`]: '#F1F1F1',
					[`base-100`]: '#292929',
					[`base-200`]: '#232323',
					[`base-300`]: '#1C1C1C',
					[`base-content`]: '#F1F1F1',
					[`info`]: '#0BBCF5',
					[`info-content`]: '#002A3C',
					[`success`]: '#00D39C',
					[`success-content`]: '#003321',
					[`warning`]: '#FEC03E',
					[`warning-content`]: '#392904',
					[`error`]: '#FF7474',
					[`error-content`]: '#4B0202'
				}
			},
			'light',
			'dark',
			'cupcake',
			'bumblebee'
		]
	}
}
