import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

export const colors = {
	shade: {
		'50': 'hsl(240 20% 95%)',
		'100': 'hsl(240 15% 77%)',
		'200': 'hsl(240 12% 63%)',
		'300': 'hsl(240 8% 54%)',
		'400': 'hsl(240 7% 40%)',
		'500': 'hsl(240 8% 30%)',
		'600': 'hsl(240 10% 21%)',
		'700': 'hsl(240 10% 16%)',
		'800': 'hsl(240 12% 12%)',
		'900': 'hsl(240 14% 9%)',
		'950': 'hsl(240 15% 7%)'
	},
	bubblegum: {
		'50': '#FDF2F6',
		'100': '#FDE6FO',
		'200': '#FCCEE1',
		'300': '#FBA6C8',
		'400': '#F76FA2',
		'500': '#EF3576',
		'600': '#E0225B',
		'700': '#C21443',
		'800': '#A01438',
		'900': '#861532',
		'950': '#520519'
	},
	mint: {
		'50': '#EFFEF6',
		'100': '#D9FFEE',
		'200': '#B5FDDD',
		'300': '#7BFAC4',
		'400': '#3BEDA2',
		'500': '#16EC92',
		'600': '#08B16A',
		'700': '#0A8B55',
		'800': '#0E6D46',
		'900': '#0E593C',
		'950': '#01321F'
	},
	squid: {
		'50': '#F4F2FF',
		'100': '#ECE7FF',
		'200': '#D9D2FF',
		'300': '#BFAEFF',
		'400': '#9F80FF',
		'500': '#824DFF',
		'600': '#803BFF',
		'700': '#6516EB',
		'800': '#5512C5',
		'900': '#4711A1',
		'950': '#29076E'
	},
	pomodoro: {
		'50': '#FEF2F2',
		'100': '#FEE2E2',
		'200': '#FECACA',
		'300': '#FCA5A5',
		'400': '#F87171',
		'500': '#EF4444',
		'600': '#DC2626',
		'700': '#B91C1C',
		'800': '#991B1B',
		'900': '#7F1D1D',
		'950': '#450A0A'
	},
	sun: {
		'50': '#FFF8EB',
		'100': '#FDE9C8',
		'200': '#FBD28C',
		'300': '#F9B450',
		'400': '#F8A33B',
		'500': '#F1760F',
		'600': '#D5540A',
		'700': '#B1370C',
		'800': '#902B10',
		'900': '#762411',
		'950': '#440F04'
	}
};

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Figtree Variable', 'Figtree', 'Noto Color Emoji', 'sans-serif'],
				emoji: ['Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', 'sans-serif']
			},
			fontSize: {
				sm: '0.875rem',
				base: '1rem',
				md: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.75rem',
				'4xl': '2rem',
				h1: '2rem',
				h2: '1.75rem',
				h3: '1.5rem',
				h4: '1.25rem',
				h5: '1.125rem',
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
				xxl: defaultTheme.spacing['12'],
				'screen-xs': '400px',
				'screen-sm': '640px',
				'screen-md': '768px',
				'screen-lg': '1024px',
				'screen-xl': '1280px',
				'screen-2xl': '1536px',
				dialog: '500px'
			},
			spacing: {
				px: '1px',
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
				'8xl': '96px',
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
				'admin-entries-list-item': '10rem minmax(900px, 1fr) repeat(16, minmax(0, 1fr))',
				entries: 'repeat(auto-fill, minmax(320px, 1fr))',
				reactions: 'repeat(auto-fill, minmax(250px, 1fr))',
				'reactions-sm': 'repeat(auto-fill, minmax(150px, 1fr))',
				emoji: 'repeat(auto-fill, minmax(48px, 1fr))'
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
				white: '#ffffff',
				black: '#000000',
				focus: colors.squid[300],
				primary: { DEFAULT: colors.squid[600], light: colors.squid[500], dark: colors.squid[700] },
				secondary: {
					DEFAULT: colors.bubblegum[600],
					light: colors.bubblegum[500],
					dark: colors.bubblegum[700]
				},
				tertiary: {
					DEFAULT: colors.sun[400],
					light: colors.sun[400],
					dark: colors.sun[700]
				},
				muted: {
					foreground: {
						DEFAULT: colors.shade[500],
						light: colors.shade[400],
						alt: colors.shade[400],
						dark: colors.shade[500]
					},
					background: {
						DEFAULT: colors.shade[800],
						dark: colors.shade[800],
						alt: colors.shade[600]
					}
				},
				'text-muted': {
					foreground: { DEFAULT: colors.shade[400], dark: colors.shade[400] },
					background: { DEFAULT: colors.shade[700], dark: colors.shade[700] }
				},
				divider: { DEFAULT: colors.shade[700] },
				success: { DEFAULT: colors.mint[500] },
				destructive: { DEFAULT: colors.pomodoro[500] },
				error: { DEFAULT: colors.pomodoro[500] },
				bg: { DEFAULT: colors.shade[950], dark: colors.shade[950] },
				...colors
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
		'max-w-screen-lg',
		'max-w-screen-md',
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
