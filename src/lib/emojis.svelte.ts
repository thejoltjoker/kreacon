import { LightbulbIcon, PawPrintIcon, PizzaIcon, SmileIcon } from 'lucide-svelte';

export interface Emoji {
	keywords: string[];
	emoji: string;
}

export const groupedEmojis = [
	{
		title: 'Smileys',
		icon: SmileIcon,
		emojis: [
			{
				keywords: ['smile', ':smile:'],
				emoji: '😊'
			},
			{
				keywords: ['grinning', 'face', 'happy', ':grinning:'],
				emoji: '😀'
			},
			{
				keywords: ['grinning', 'sweat', 'nervous', ':grinning_sweat:'],
				emoji: '😅'
			},
			{
				keywords: ['joy', 'tears', 'laugh', ':joy:'],
				emoji: '😂'
			},
			{
				keywords: ['halo', 'angel', 'good', ':halo:'],
				emoji: '😇'
			},
			{
				keywords: ['hearts', 'love', 'affection', ':hearts:'],
				emoji: '🥰'
			},
			{
				keywords: ['heart', 'eyes', 'love', ':heart_eyes:'],
				emoji: '😍'
			},
			{
				keywords: ['star', 'struck', 'amazing', ':star_struck:'],
				emoji: '🤩'
			},
			{
				keywords: ['tear', 'smile', 'bittersweet', ':smiling_tear:'],
				emoji: '🥲'
			},
			{
				keywords: ['party', 'celebrate', 'joy', ':party:'],
				emoji: '🥳'
			},
			{
				keywords: ['cool', 'sunglasses', 'confident', ':sunglasses:'],
				emoji: '😎'
			},
			{
				keywords: ['peek', 'eye', 'frightened', ':peeking_eye:'],
				emoji: '🫣'
			},
			{
				keywords: ['zany', 'silly', 'fun', ':zany_face:'],
				emoji: '🤪'
			},
			{
				keywords: ['nerd', 'glasses', 'smart', ':nerd_face:'],
				emoji: '🤓'
			},
			{
				keywords: ['grimace', 'nervous', 'awkward', ':grimacing:'],
				emoji: '😬'
			},
			{
				keywords: ['roll', 'eyes', 'annoyed', ':rolling_eyes:'],
				emoji: '🙄'
			}
		]
	},
	{
		title: 'Food & Drink',
		icon: PizzaIcon,
		emojis: [
			{
				keywords: ['pineapple', 'fruit', ':pineapple:'],
				emoji: '🍍'
			},
			{
				keywords: ['banana', 'fruit', ':banana:'],
				emoji: '🍌'
			}
		]
	},
	{
		title: 'Objects',
		icon: LightbulbIcon,
		emojis: [
			{
				keywords: ['lightbulb', 'idea', ':lightbulb:'],
				emoji: '💡'
			}
		]
	},
	{
		title: 'Animals & Nature',
		icon: PawPrintIcon,
		emojis: [
			{
				keywords: ['pig', 'animal', ':pig:'],
				emoji: '🐖'
			},
			{
				keywords: ['rooster', 'bird', ':rooster:'],
				emoji: '🐓'
			},
			{
				keywords: ['rabbit', 'bunny', ':rabbit:'],
				emoji: '🐇'
			},
			{
				keywords: ['chicken', 'bird', ':chicken:'],
				emoji: '🐔'
			},
			{
				keywords: ['fire', 'flame', ':fire:'],
				emoji: '🔥'
			},
			{
				keywords: ['new', 'moon', 'face', ':new_moon_face:'],
				emoji: '🌚'
			},
			{
				keywords: ['full', 'moon', 'face', ':full_moon_face:'],
				emoji: '🌝'
			},
			{
				keywords: ['rainbow', 'colorful', ':rainbow:'],
				emoji: '🌈'
			},
			{
				keywords: ['high', 'voltage', 'electric', ':high_voltage:'],
				emoji: '⚡'
			},
			{
				keywords: ['star', 'night', ':star:'],
				emoji: '⭐'
			},
			{
				keywords: ['sauropod', 'dinosaur', ':sauropod:'],
				emoji: '🦕'
			},
			{
				keywords: ['t-rex', 'dinosaur', ':t_rex:'],
				emoji: '🦖'
			},
			{
				keywords: ['llama', 'animal', ':llama:'],
				emoji: '🦙'
			}
		]
	}
];
