import type { MediaType } from '$lib/types/mediaTypes';
import { db } from '../../db';
import * as schema from '../../db/schema';
import data from './data/categories.json';

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (category) => {
			await db
				.insert(schema.categories)
				.values({
					...category,
					allowedMediaType: category.allowedMediaType as MediaType
				})
				.returning();
		})
	);
};
export default seed;
