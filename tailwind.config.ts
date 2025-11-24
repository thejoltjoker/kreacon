import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import forms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Figtree Variable', 'Figtree', 'Noto Color Emoji', 'sans-serif'],
				emoji: ['Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', 'sans-serif']
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

			width: {
				sidebar: '20rem',
				'profile-sidebar': '260px'
			},
			gridTemplateColumns: {
				'admin-submissions-list-item': '10rem minmax(900px, 1fr) repeat(16, minmax(0, 1fr))',
				submissions: 'repeat(auto-fill, minmax(400px, 1fr))',
				'admin-entries-list-item': '10rem minmax(900px, 1fr) repeat(16, minmax(0, 1fr))',
				entries: 'repeat(auto-fill, minmax(320px, 1fr))',
				reactions: 'repeat(auto-fill, minmax(250px, 1fr))',
				'reactions-sm': 'repeat(auto-fill, minmax(150px, 1fr))',
				emoji: 'repeat(auto-fill, minmax(48px, 1fr))'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				},
				wiggle: {
					'0%,100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
				wiggle: 'wiggle 0.2s ease-out infinite',
				fadeIn: 'fadeIn 0.2s ease-out'
			}
		}
	},
	safelist: [
		'media-tooltip',
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
		'max-w-(--breakpoint-lg)',
		'max-w-(--breakpoint-md)',
		'border-white',
		'border',
		'list-inside',
		'list-disc',
		'[&_ul]:list-disc',
		'[&_ul]:list-inside'
	],
	darkMode: 'selector',
	plugins: [forms, animate]
} as Config;
