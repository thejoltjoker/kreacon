import { db } from '../db';
import { media, type InsertMedia } from '../db/schema';

export const seedMedia = async () => {
	const values: InsertMedia[] = [
		{
			id: 1,
			type: 'image',
			url: 'StrongCuriousChihuahua.png',
			submissionId: 'StrongCuriousChihuahua',
			alt: 'Whispers of the Forgotten Forest'
		},
		{
			id: 2,
			type: 'image',
			url: 'StrongCuriousHerring.png',
			submissionId: 'StrongCuriousHerring',
			alt: 'Echoes in the Urban Labyrinth'
		},
		{
			id: 3,
			type: 'image',
			url: 'StrongCuriousBloodhound.png',
			submissionId: 'StrongCuriousBloodhound',
			alt: 'Fragments of a Shattered Dream'
		},
		{
			id: 4,
			type: 'image',
			url: 'StrongCuriousDuck.png',
			submissionId: 'StrongCuriousDuck',
			alt: "The Dancer's Last Pirouette"
		},
		{
			id: 5,
			type: 'image',
			url: 'StrongCuriousGoat.png',
			submissionId: 'StrongCuriousGoat',
			alt: "Nebula's Lullaby"
		},
		{
			id: 6,
			type: 'image',
			url: 'StrongCuriousMacaw.png',
			submissionId: 'StrongCuriousMacaw',
			alt: "Shadows of Yesterday's Tomorrow"
		},
		{
			id: 7,
			type: 'image',
			url: 'StrongCuriousOctopus.png',
			submissionId: 'StrongCuriousOctopus',
			alt: 'The Clockwork Heart'
		},
		{
			id: 8,
			type: 'image',
			url: 'StrongCuriousVole.png',
			submissionId: 'StrongCuriousVole',
			alt: 'Melodies from a Rusty Piano'
		},
		{
			id: 9,
			type: 'image',
			url: 'StrongCuriousWolffish.png',
			submissionId: 'StrongCuriousWolffish',
			alt: 'Reflections in a Broken Mirror'
		},
		{
			id: 10,
			type: 'image',
			url: 'StrongCuriousStoat.png',
			submissionId: 'StrongCuriousStoat',
			alt: 'The Lighthouse at the Edge of Time'
		},
		{
			id: 11,
			type: 'image',
			url: 'StrongCuriousMongrel.png',
			submissionId: 'StrongCuriousMongrel',
			alt: "Autumn's Fiery Embrace"
		},
		{
			id: 12,
			type: 'image',
			url: 'StrongCuriousCivet.png',
			submissionId: 'StrongCuriousCivet',
			alt: 'Secrets of the Deep Blue'
		},
		{
			id: 13,
			type: 'image',
			url: 'StrongCuriousCentipede.png',
			submissionId: 'StrongCuriousCentipede',
			alt: "The Alchemist's Final Experiment"
		},
		{
			id: 14,
			type: 'image',
			url: 'StrongCuriousLlama.png',
			submissionId: 'StrongCuriousLlama',
			alt: 'Whispers in the Wind Chimes'
		},
		{
			id: 15,
			type: 'image',
			url: 'StrongCuriousSwan.png',
			submissionId: 'StrongCuriousSwan',
			alt: 'Neon Dreams in Tokyo'
		},
		{
			id: 16,
			type: 'image',
			url: 'StrongCuriousMonkfish.png',
			submissionId: 'StrongCuriousMonkfish',
			alt: 'The Butterfly Effect'
		},
		// Alice Smith
		{
			id: 17,
			type: 'image',
			url: 'StrongCuriousYak.png',
			submissionId: 'StrongCuriousYak',
			alt: 'The Physical Impossibility of Death in the Mind of Someone Living'
		},
		{
			id: 18,
			type: 'image',
			url: 'StrongCuriousTamarin.png',
			submissionId: 'StrongCuriousTamarin',
			alt: 'Balloon Dog'
		},
		{
			id: 19,
			type: 'image',
			url: 'StrongCuriousOkapi.png',
			submissionId: 'StrongCuriousOkapi',
			alt: 'My Bed'
		},
		{
			id: 20,
			type: 'image',
			url: 'StrongCuriousMuskrat.png',
			submissionId: 'StrongCuriousMuskrat',
			alt: 'Girl with Balloon'
		},
		{
			id: 21,
			type: 'image',
			url: 'StrongCuriousGrouse.png',
			submissionId: 'StrongCuriousGrouse',
			alt: '99 Cent'
		},
		{
			id: 22,
			type: 'image',
			url: 'StrongCuriousGrasshopper.png',
			submissionId: 'StrongCuriousGrasshopper',
			alt: 'Untitled Film Stills'
		},
		{
			id: 23,
			type: 'image',
			url: 'StrongCuriousBongo.png',
			submissionId: 'StrongCuriousBongo',
			alt: 'The Cremaster Cycle'
		},
		{
			id: 24,
			type: 'image',
			url: 'StrongCuriousRockfish.png',
			submissionId: 'StrongCuriousRockfish',
			alt: 'Truisms'
		},
		{
			id: 25,
			type: 'image',
			url: 'StrongCuriousOlm.png',
			submissionId: 'StrongCuriousOlm',
			alt: 'And Then, And Then And Then And Then And Then'
		},
		{
			id: 26,
			type: 'image',
			url: 'StrongCuriousChicken.png',
			submissionId: 'StrongCuriousChicken',
			alt: 'Crack is Wack'
		},
		{
			id: 27,
			type: 'image',
			url: 'StrongCuriousGorilla.png',
			submissionId: 'StrongCuriousGorilla',
			alt: 'Riding with Death'
		},
		{
			id: 28,
			type: 'image',
			url: 'StrongCuriousLynx.png',
			submissionId: 'StrongCuriousLynx',
			alt: 'The Ballad of Sexual Dependency'
		},
		{
			id: 29,
			type: 'image',
			url: 'StrongCuriousMastiff.png',
			submissionId: 'StrongCuriousMastiff',
			alt: 'La Nona Ora'
		},
		{
			id: 30,
			type: 'image',
			url: 'StrongCuriousOtter.png',
			submissionId: 'StrongCuriousOtter',
			alt: "Infinity Mirror Room - Phalli's Field"
		},
		{
			id: 31,
			type: 'image',
			url: 'StrongCuriousPanther.png',
			submissionId: 'StrongCuriousPanther',
			alt: 'Cloud Gate'
		},
		{
			id: 32,
			type: 'image',
			url: 'StrongCuriousWolfhound.png',
			submissionId: 'StrongCuriousWolfhound',
			alt: 'Your Body is a Battleground'
		}
	];
	await db.insert(media).values(values).onConflictDoNothing();
};
