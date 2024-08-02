import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				sans: [...fontFamily.sans],
				slab: ['"Public Sans"', 'sans-serif'],
			},
		},
	},
	plugins: [require('daisyui')],
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
					[`error-content`]: '#4B0202',
				},
			},
			'light',
			'dark',
			'cupcake',
			'bumblebee',
		],
	},
}

export default config
