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

import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import * as schema from '../../db/schema';
import data from './data/submissions.json';

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
	const [category] = await db
		.select()
		.from(schema.categoriesToEvents)
		.innerJoin(schema.categories, eq(schema.categories.id, schema.categoriesToEvents.categoryId))
		.where(
			and(eq(schema.categoriesToEvents.eventId, eventId), eq(schema.categories.name, categoryName))
		)
		.limit(1);

	if (!category) {
		throw new Error('Unknown category: ' + categoryName);
	}
	return category.category.id;
}

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (submission) => {
			const userId = await getUserId(db, submission.user.email);
			const eventId = await getEventId(db, submission.event.name);
			const categoryId = await getCategoryId(db, eventId, submission.category.name);
			await db.transaction(async (tx) => {
				const [insertedMedia] = await tx
					.insert(schema.media)
					.values({
						...submission.media,
						type: submission.media.type as 'image' | 'video' | 'audio'
					})
					.returning();

				const [insertedSubmission] = await tx
					.insert(schema.submissions)
					.values({
						...submission,
						eventId: eventId,
						categoryId: categoryId,
						userId: userId,
						mediaId: insertedMedia.id
					})
					.returning();

				await tx
					.update(schema.media)
					.set({
						submissionId: insertedSubmission.id
					})
					.where(eq(schema.media.id, insertedMedia.id));
			});
		})
	);
};
export default seed;
