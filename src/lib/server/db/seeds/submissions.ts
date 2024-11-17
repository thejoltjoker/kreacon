// export const seedSubmissions = async () => {
// 	const values: InsertSubmission[] = [
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

// await db.insert(submissions).values(values).onConflictDoNothing();
// };

import { db } from '@/lib/server/db';
import * as schema from '@/lib/server/db/schema';
import data from './data/submissions.json';
import { and, eq } from 'drizzle-orm';

async function getUserId(db: db, email: string) {
	const user = await db.query.users.findFirst({
		where: eq(schema.users.email, email)
	});
	if (!user) {
		throw new Error('Unknown user: ' + email);
	}
	return user.id;
}

async function getEventId(db: db, eventName: string) {
	const event = await db.query.events.findFirst({
		where: eq(schema.events.name, eventName)
	});
	if (!event) {
		throw new Error('Unknown event: ' + eventName);
	}
	return event.id;
}

async function getCategoryId(db: db, eventId: number, categoryName: string) {
	const category = await db.query.categoriesToEvents.findFirst({
		where: (categoriesToEvents, { eq }) => eq(categoriesToEvents.eventId, eventId),
		with: {
			category: {
				where: (category, { eq }) => eq(category.name, categoryName)
			}
		}
	});
	if (!category) {
		throw new Error('Unknown menu item category: ' + categoryName);
	}
	return category.id;
}

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (submission) => {
			const userId = await getUserId(db, submission.user.email);
			const eventId = await getEventId(db, submission.event.name);
			const categoryId = await getCategoryId(db, eventId, submission.category);
			const [insertedSubmission] = await db
				.insert(schema.submissions)
				.values({
					...submission,
					eventId: eventId,
					categoryId: categoryId
				})
				.onConflictDoNothing()
				.returning();

			await db.insert(schema.media).values({
				...submission.media,
				submissionId: insertedSubmission.id
			});
		})
	);
};
export default seed;

// {
// 	"id": "StrongCuriousHerring",
// 	"user": "john.doe@example.com",
// 	"categoryId": 2,
// 	"eventId": 1,
// 	"title": "Echoes in the Urban Labyrinth",
// 	"mediaId": 2
// },
// {
// 	"id": "StrongCuriousBloodhound",
// 	"user": "john.doe@example.com",
// 	"categoryId": 3,
// 	"eventId": 1,
// 	"title": "Fragments of a Shattered Dream",
// 	"mediaId": 3
// },
// {
// 	"id": "StrongCuriousDuck",
// 	"user": "john.doe@example.com",
// 	"categoryId": 4,
// 	"eventId": 1,
// 	"title": "The Dancer's Last Pirouette",
// 	"mediaId": 4
// },
// {
// 	"id": "StrongCuriousGoat",
// 	"user": "john.doe@example.com",
// 	"categoryId": 5,
// 	"eventId": 1,
// 	"title": "Nebula's Lullaby",
// 	"mediaId": 5
// },
// {
// 	"id": "StrongCuriousMacaw",
// 	"user": "john.doe@example.com",
// 	"categoryId": 6,
// 	"eventId": 1,
// 	"title": "Shadows of Yesterday's Tomorrow",
// 	"mediaId": 6
// },
// {
// 	"id": "StrongCuriousOctopus",
// 	"user": "john.doe@example.com",
// 	"categoryId": 7,
// 	"eventId": 1,
// 	"title": "The Clockwork Heart",
// 	"mediaId": 7
// },
// {
// 	"id": "StrongCuriousVole",
// 	"user": "john.doe@example.com",
// 	"categoryId": 8,
// 	"eventId": 1,
// 	"title": "Melodies from a Rusty Piano",
// 	"mediaId": 8
// },
// {
// 	"id": "StrongCuriousWolffish",
// 	"user": "john.doe@example.com",
// 	"categoryId": 1,
// 	"eventId": 2,
// 	"title": "Reflections in a Broken Mirror",
// 	"mediaId": 9
// },
// {
// 	"id": "StrongCuriousStoat",
// 	"user": "john.doe@example.com",
// 	"categoryId": 2,
// 	"eventId": 2,
// 	"title": "The Lighthouse at the Edge of Time",
// 	"mediaId": 10
// },
// {
// 	"id": "StrongCuriousMongrel",
// 	"user": "john.doe@example.com",
// 	"categoryId": 3,
// 	"eventId": 2,
// 	"title": "Autumn's Fiery Embrace",
// 	"mediaId": 11
// },
// {
// 	"id": "StrongCuriousCivet",
// 	"user": "john.doe@example.com",
// 	"categoryId": 4,
// 	"eventId": 2,
// 	"title": "Secrets of the Deep Blue",
// 	"mediaId": 12
// },
// {
// 	"id": "StrongCuriousCentipede",
// 	"user": "john.doe@example.com",
// 	"categoryId": 5,
// 	"eventId": 2,
// 	"title": "The Alchemist's Final Experiment",
// 	"mediaId": 13
// },
// {
// 	"id": "StrongCuriousLlama",
// 	"user": "john.doe@example.com",
// 	"categoryId": 6,
// 	"eventId": 2,
// 	"title": "Whispers in the Wind Chimes",
// 	"mediaId": 14
// },
// {
// 	"id": "StrongCuriousSwan",
// 	"user": "john.doe@example.com",
// 	"categoryId": 7,
// 	"eventId": 2,
// 	"title": "Neon Dreams in Tokyo",
// 	"mediaId": 15
// },
// {
// 	"id": "StrongCuriousMonkfish",
// 	"user": "john.doe@example.com",
// 	"categoryId": 8,
// 	"eventId": 2,
// 	"title": "The Butterfly Effect",
// 	"mediaId": 16
// },

// {
// 	"id": "StrongCuriousYak",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 1,
// 	"eventId": 1,
// 	"title": "The Physical Impossibility of Death in the Mind of Someone Living",
// 	"mediaId": 17
// },
// {
// 	"id": "StrongCuriousTamarin",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 2,
// 	"eventId": 1,
// 	"title": "Balloon Dog",
// 	"mediaId": 18
// },
// {
// 	"id": "StrongCuriousOkapi",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 3,
// 	"eventId": 1,
// 	"title": "My Bed",
// 	"mediaId": 19
// },
// {
// 	"id": "StrongCuriousMuskrat",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 4,
// 	"eventId": 1,
// 	"title": "Girl with Balloon",
// 	"mediaId": 20
// },
// {
// 	"id": "StrongCuriousGrouse",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 5,
// 	"eventId": 1,
// 	"title": "99 Cent",
// 	"mediaId": 21
// },
// {
// 	"id": "StrongCuriousGrasshopper",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 6,
// 	"eventId": 1,
// 	"title": "Untitled Film Stills",
// 	"mediaId": 22
// },
// {
// 	"id": "StrongCuriousBongo",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 7,
// 	"eventId": 1,
// 	"title": "The Cremaster Cycle",
// 	"mediaId": 23
// },
// {
// 	"id": "StrongCuriousRockfish",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 8,
// 	"eventId": 1,
// 	"title": "Truisms",
// 	"mediaId": 24
// },
// {
// 	"id": "StrongCuriousOlm",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 1,
// 	"eventId": 2,
// 	"title": "And Then, And Then And Then And Then And Then",
// 	"mediaId": 25
// },
// {
// 	"id": "StrongCuriousChicken",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 2,
// 	"eventId": 2,
// 	"title": "Crack is Wack",
// 	"mediaId": 26
// },
// {
// 	"id": "StrongCuriousGorilla",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 3,
// 	"eventId": 2,
// 	"title": "Riding with Death",
// 	"mediaId": 27
// },
// {
// 	"id": "StrongCuriousLynx",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 4,
// 	"eventId": 2,
// 	"title": "The Ballad of Sexual Dependency",
// 	"mediaId": 28
// },
// {
// 	"id": "StrongCuriousMastiff",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 5,
// 	"eventId": 2,
// 	"title": "La Nona Ora",
// 	"mediaId": 29
// },
// {
// 	"id": "StrongCuriousOtter",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 6,
// 	"eventId": 2,
// 	"title": "Infinity Mirror Room - Phalli's Field",
// 	"mediaId": 30
// },
// {
// 	"id": "StrongCuriousPanther",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 7,
// 	"eventId": 2,
// 	"title": "Cloud Gate",
// 	"mediaId": 31
// },
// {
// 	"id": "StrongCuriousWolfhound",
// 	"user": "alice.smith@example.com",
// 	"categoryId": 8,
// 	"eventId": 2,
// 	"title": "Your Body is a Battleground",
// 	"mediaId": 32
// }
