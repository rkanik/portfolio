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
	plugins: [require('daisyui')]
}
