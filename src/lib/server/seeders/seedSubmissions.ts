import { db } from '$lib/server/db';
import { submissions, type InsertSubmission } from '$lib/server/db/schema';

export const seedSubmissions = async () => {
	const values: InsertSubmission[] = [
		// Ids to use:
		// StrongCuriousPorcupine
		// StrongCuriousDachshund
		// StrongCuriousMandrill
		// StrongCuriousWolverine
		// StrongCuriousChimpanzee
		// StrongCuriousLoach
		// StrongCuriousKakapo
		// StrongCuriousBee
		// StrongCuriousFlamingo
		// StrongCuriousCoelacanth
		// StrongCuriousSiberian
		// StrongCuriousMoth
		// StrongCuriousZebu
		// StrongCuriousDodo
		// StrongCuriousCoral
		// StrongCuriousStingray
		// StrongCuriousBichir
		// StrongCuriousNightingale
		// StrongCuriousEchidna
		// StrongCuriousMayfly
		// StrongCuriousTetra
		// StrongCuriousParrot
		// StrongCuriousMarmot
		// StrongCuriousAbyssinian
		// StrongCuriousChameleon
		// StrongCuriousIguana
		// StrongCuriousChamois
		{
			id: 'StrongCuriousChihuahua',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 1,
			eventId: 1,
			title: 'Whispers of the Forgotten Forest',
			mediaId: 1
		},
		{
			id: 'StrongCuriousHerring',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 2,
			eventId: 1,
			title: 'Echoes in the Urban Labyrinth',
			mediaId: 2
		},
		{
			id: 'StrongCuriousBloodhound',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 3,
			eventId: 1,
			title: 'Fragments of a Shattered Dream',
			mediaId: 3
		},
		{
			id: 'StrongCuriousDuck',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 4,
			eventId: 1,
			title: "The Dancer's Last Pirouette",
			mediaId: 4
		},
		{
			id: 'StrongCuriousGoat',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 5,
			eventId: 1,
			title: "Nebula's Lullaby",
			mediaId: 5
		},
		{
			id: 'StrongCuriousMacaw',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 6,
			eventId: 1,
			title: "Shadows of Yesterday's Tomorrow",
			mediaId: 6
		},
		{
			id: 'StrongCuriousOctopus',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 7,
			eventId: 1,
			title: 'The Clockwork Heart',
			mediaId: 7
		},
		{
			id: 'StrongCuriousVole',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 8,
			eventId: 1,
			title: 'Melodies from a Rusty Piano',
			mediaId: 8
		},
		{
			id: 'StrongCuriousWolffish',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 1,
			eventId: 2,
			title: 'Reflections in a Broken Mirror',
			mediaId: 9
		},
		{
			id: 'StrongCuriousStoat',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 2,
			eventId: 2,
			title: 'The Lighthouse at the Edge of Time',
			mediaId: 10
		},
		{
			id: 'StrongCuriousMongrel',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 3,
			eventId: 2,
			title: "Autumn's Fiery Embrace",
			mediaId: 11
		},
		{
			id: 'StrongCuriousCivet',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 4,
			eventId: 2,
			title: 'Secrets of the Deep Blue',
			mediaId: 12
		},
		{
			id: 'StrongCuriousCentipede',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 5,
			eventId: 2,
			title: "The Alchemist's Final Experiment",
			mediaId: 13
		},
		{
			id: 'StrongCuriousLlama',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 6,
			eventId: 2,
			title: 'Whispers in the Wind Chimes',
			mediaId: 14
		},
		{
			id: 'StrongCuriousSwan',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 7,
			eventId: 2,
			title: 'Neon Dreams in Tokyo',
			mediaId: 15
		},
		{
			id: 'StrongCuriousMonkfish',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 8,
			eventId: 2,
			title: 'The Butterfly Effect',
			mediaId: 16
		},
		// Alice Smith
		{
			id: 'StrongCuriousYak',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 1,
			eventId: 1,
			title: 'The Physical Impossibility of Death in the Mind of Someone Living',
			mediaId: 17
		},
		{
			id: 'StrongCuriousTamarin',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 2,
			eventId: 1,
			title: 'Balloon Dog',
			mediaId: 18
		},
		{
			id: 'StrongCuriousOkapi',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 3,
			eventId: 1,
			title: 'My Bed',
			mediaId: 19
		},
		{
			id: 'StrongCuriousMuskrat',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 4,
			eventId: 1,
			title: 'Girl with Balloon',
			mediaId: 20
		},
		{
			id: 'StrongCuriousGrouse',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 5,
			eventId: 1,
			title: '99 Cent',
			mediaId: 21
		},
		{
			id: 'StrongCuriousGrasshopper',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 6,
			eventId: 1,
			title: 'Untitled Film Stills',
			mediaId: 22
		},
		{
			id: 'StrongCuriousBongo',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 7,
			eventId: 1,
			title: 'The Cremaster Cycle',
			mediaId: 23
		},
		{
			id: 'StrongCuriousRockfish',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 8,
			eventId: 1,
			title: 'Truisms',
			mediaId: 24
		},
		{
			id: 'StrongCuriousOlm',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 1,
			eventId: 2,
			title: 'And Then, And Then And Then And Then And Then',
			mediaId: 25
		},
		{
			id: 'StrongCuriousChicken',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 2,
			eventId: 2,
			title: 'Crack is Wack',
			mediaId: 26
		},
		{
			id: 'StrongCuriousGorilla',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 3,
			eventId: 2,
			title: 'Riding with Death',
			mediaId: 27
		},
		{
			id: 'StrongCuriousLynx',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 4,
			eventId: 2,
			title: 'The Ballad of Sexual Dependency',
			mediaId: 28
		},
		{
			id: 'StrongCuriousMastiff',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 5,
			eventId: 2,
			title: 'La Nona Ora',
			mediaId: 29
		},
		{
			id: 'StrongCuriousOtter',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 6,
			eventId: 2,
			title: "Infinity Mirror Room - Phalli's Field",
			mediaId: 30
		},
		{
			id: 'StrongCuriousPanther',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 7,
			eventId: 2,
			title: 'Cloud Gate',
			mediaId: 31
		},
		{
			id: 'StrongCuriousWolfhound',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			categoryId: 8,
			eventId: 2,
			title: 'Your Body is a Battleground',
			mediaId: 32
		}
	];
	await db.insert(submissions).values(values).onConflictDoNothing();
};
