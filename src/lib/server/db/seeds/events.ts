import { db } from '@/lib/server/db';
import * as schema from '@/lib/server/db/schema';
import data from './data/events.json';
import { eq } from 'drizzle-orm';

async function getCategoryId(db: db, categoryName: string) {
	const category = await db.query.categories.findFirst({
		where: eq(schema.categories.name, categoryName)
	});
	if (!category) {
		throw new Error('Unknown category: ' + categoryName);
	}
	return category.id;
}

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (event) => {
			const [insertedEvent] = await db
				.insert(schema.events)
				.values({
					...event
				})
				.onConflictDoNothing()
				.returning();

			await Promise.all(
				event.categories?.map(async (category) => {
					const categoryId = await getCategoryId(db, category.name);
					await db.insert(schema.categoriesToEvents).values({
						categoryId,
						eventId: insertedEvent.id
					});
				})
			);
		})
	);
};
export default seed;
