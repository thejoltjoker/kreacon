import type { Config } from 'tailwindcss';
import twForms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';
import defaultColors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Figtree', 'sans-serif'],
				emoji: ['Noto Color Emoji', 'sans-serif']
			},
			fontSize: {
				sm: '1rem',
				base: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.563rem',
				'3xl': '1.953rem',
				'4xl': '2.441rem',
				'5xl': '3.052rem',
				h1: '1.953rem',
				h2: '1.563rem',
				h3: '1.25rem',
				h4: '1.125rem',
				h5: '1rem',
				h6: '1rem'
			},
			scale: {
				98: '.98'
			},
			strokeWidth: {
				1: '1',
				2: '2',
				3: '3',
				4: '4'
			},
			maxWidth: {
				xxs: defaultTheme.spacing['2'],
				xs: defaultTheme.spacing['3'],
				sm: defaultTheme.spacing['4'],
				md: defaultTheme.spacing['6'],
				lg: defaultTheme.spacing['8'],
				xl: defaultTheme.spacing['10'],
				xxl: defaultTheme.spacing['12']
			},
			spacing: {
				'3xs': '2px',
				'2xs': '4px',
				xs: '8px',
				sm: '12px',
				md: '16px',
				lg: '20px',
				xl: '24px',
				'2xl': '28px',
				'3xl': '32px',
				'4xl': '36px',
				'5xl': '40px',
				'6xl': '44px',
				'7xl': '48px',
				form: '48px',
				'input-sm': '40px',
				'input-md': '48px',
				'input-lg': '56px',
				'avatar-sm': '48px',
				'avatar-md': '64px',
				'avatar-lg': '96px',
				reaction: '4rem',
				thumbnail: defaultTheme.spacing['40']
			},
			width: {
				sidebar: '20rem',
				'profile-sidebar': '260px'
			},
			gridTemplateColumns: {
				'admin-submissions-list-item': '10rem minmax(900px, 1fr) repeat(16, minmax(0, 1fr))',
				submissions: 'repeat(auto-fill, minmax(400px, 1fr))',
				reactions: 'repeat(auto-fill, minmax(250px, 1fr))'
			},
			borderRadius: {
				'3xs': '2px',
				'2xs': '4px',
				xs: '8px',
				sm: '12px',
				md: '16px',
				lg: '20px',
				xl: '24px',
				'2xl': '28px',
				'3xl': '32px',
				'4xl': '36px',
				'5xl': '40px',
				'6xl': '44px',
				'7xl': '48px',
				form: '12px',
				button: '9999px'
			},
			colors: {
				primary: defaultColors.violet,
				secondary: defaultColors.blue,
				muted: defaultColors.zinc[600],
				divider: defaultColors.zinc[800],
				success: defaultColors.green[500],
				error: defaultColors.red[500],
				surface: {
					DEFAULT: 'rgb(9 9 10)',
					muted: defaultColors.zinc[900],
					subtle: defaultColors.zinc[800]
				},
				black: 'rgb(9 9 10)',
				amber: {
					'50': '#fffeea',
					'100': '#fffac5',
					'200': '#fff685',
					'300': '#ffea46',
					'400': '#ffdb1b',
					'500': '#ffbe0b',
					'600': '#e29000',
					'700': '#bb6502',
					'800': '#984e08',
					'900': '#7c400b',
					'950': '#482100'
				},
				orange: {
					'50': '#fff7ec',
					'100': '#ffecd3',
					'200': '#ffd5a7',
					'300': '#ffb76f',
					'400': '#ff8d35',
					'500': '#ff6e0e',
					'600': '#fb5607',
					'700': '#c93a05',
					'800': '#9f2f0d',
					'900': '#80290e',
					'950': '#451205'
				},
				rose: {
					'50': '#ffeff3',
					'100': '#ffe0ea',
					'200': '#ffc6da',
					'300': '#ff97bb',
					'400': '#ff5d98',
					'500': '#ff247a',
					'600': '#ff006e',
					'700': '#d7005d',
					'800': '#b40056',
					'900': '#990250',
					'950': '#570026'
				},
				violet: {
					'50': '#f6f3ff',
					'100': '#eee9fe',
					'200': '#dfd6fe',
					'300': '#c7b5fd',
					'400': '#ac8bfa',
					'500': '#925df5',
					'600': '#8338ec',
					'700': '#7529d8',
					'800': '#6222b5',
					'900': '#521d95',
					'950': '#321065'
				},
				blue: {
					'50': '#eef6ff',
					'100': '#d9eaff',
					'200': '#bcdbff',
					'300': '#8ec6ff',
					'400': '#59a5ff',
					'500': '#3a86ff',
					'600': '#1b60f5',
					'700': '#144be1',
					'800': '#173db6',
					'900': '#19388f',
					'950': '#142357'
				}
			}
		}
	},
	safelist: [
		'border-red-500',
		'border-green-500',
		'border-violet-500',
		'focus:ring-red-500',
		'focus:ring-green-500',
		'focus:ring-violet-500',
		'invalid',
		'valid',
		'bg-white',
		'bg-black',
		'input-valid',
		'input-invalid',
		'max-w-screen-lg',
		'max-w-screen-md'
	],

	plugins: [twForms]
} as Config;
