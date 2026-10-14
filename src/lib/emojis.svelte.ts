import { LightbulbIcon, PawPrintIcon, PizzaIcon, SmileIcon } from '@lucide/svelte';

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
			},
			{
				keywords: ['alien', 'extraterrestrial', 'space', ':alien:'],
				emoji: '👽'
			},
			{
				keywords: ['alien', 'monster', 'space', 'game', ':alien_monster:'],
				emoji: '👾'
			},
			{
				keywords: ['ghost', 'spooky', 'halloween', ':ghost:'],
				emoji: '👻'
			},
			{
				keywords: ['clown', 'circus', 'foolish', ':clown_face:'],
				emoji: '🤡'
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
				keywords: ['poo', 'poop', 'pile', ':pile_of_poo:'],
				emoji: '💩'
			},
			{
				keywords: ['lightbulb', 'idea', ':lightbulb:'],
				emoji: '💡'
			},
			{
				keywords: ['robot', 'face', 'electronics', ':robot:'],
				emoji: '🤖'
			},
			{
				keywords: ['gem', 'stone', 'jewel', ':gem_stone:'],
				emoji: '💎'
			},
			{
				keywords: ['floppy', 'disk', 'save', ':floppy_disk:'],
				emoji: '💾'
			},
			{
				keywords: ['clapper', 'board', 'film', ':clapper_board:'],
				emoji: '🎬'
			},
			{
				keywords: ['hourglass', 'time', 'not done', ':hourglass_not_done:'],
				emoji: '⏳'
			},
			{
				keywords: ['money', 'wings', 'flying', ':money_with_wings:'],
				emoji: '💸'
			},
			{
				keywords: ['dollar', 'banknote', 'money', ':dollar_banknote:'],
				emoji: '💵'
			},
			{
				keywords: ['money', 'bag', 'wealth', ':money_bag:'],
				emoji: '💰'
			},
			{
				keywords: ['luggage', 'travel', 'suitcase', ':luggage:'],
				emoji: '🧳'
			},
			{
				keywords: ['bomb', 'explosion', 'danger', ':bomb:'],
				emoji: '💣'
			},
			{
				keywords: ['toilet', 'bathroom', 'restroom', ':toilet:'],
				emoji: '🚽'
			},
			{
				keywords: ['mouse', 'trap', 'catch', ':mouse_trap:'],
				emoji: '🪤'
			}
		]
	},
	{
		title: 'Animals & Nature',
		icon: PawPrintIcon,
		emojis: [
			{
				keywords: ['cat', 'heart', 'eyes', ':smiling_cat_with_heart_eyes:'],
				emoji: '😻'
			},
			{
				keywords: ['weary', 'cat', 'face', ':weary_cat:'],
				emoji: '🙀'
			},

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
			},
			{
				keywords: ['see', 'no', 'evil', 'monkey', ':see_no_evil_monkey:'],
				emoji: '🙈'
			},
			{
				keywords: ['speak', 'no', 'evil', 'monkey', ':speak_no_evil_monkey:'],
				emoji: '🙊'
			},
			{
				keywords: ['hear', 'no', 'evil', 'monkey', ':hear_no_evil_monkey:'],
				emoji: '🙉'
			}
		]
	}
];
