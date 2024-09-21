import type { Config } from 'tailwindcss';
import twForms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Figtree', 'sans-serif']
			},
			spacing: {
				xs: '0.6rem',
				sm: '1.2rem',
				md: '1.6rem',
				lg: '2rem',
				xl: '2.4rem',
				xxl: '4.8rem',
				form: '3.2rem',
				button: '3.2rem'
			},
			borderRadius: {
				sm: '.8rem',
				md: '1.6rem',
				lg: '2.4rem',
				xl: '3.2rem'
			},
			colors: {
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
		'valid'
	],

	plugins: [twForms]
} as Config;
