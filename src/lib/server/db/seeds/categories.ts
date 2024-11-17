import { db } from '@/lib/server/db';
import * as schema from '@/lib/server/db/schema';
import data from './data/categories.json';

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (category) => {
			await db
				.insert(schema.categories)
				.values({
					...category
				})
				.onConflictDoNothing()
				.returning();
		})
	);
};
export default seed;
