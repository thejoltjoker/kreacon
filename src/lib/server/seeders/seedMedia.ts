import { db } from '../db';
import { media, type InsertMedia } from '../db/schema';

export const seedMedia = async () => {
	const values: InsertMedia[] = [
		{
			type: 'image',
			url: 'HeartfeltTastyMeerkat.webp',
			id: 1,
			submissionId: 'HeartfeltTastyMeerkat',
			alt: 'A tasty meerkat'
		}
	];
	await db.insert(media).values(values).onConflictDoNothing();
};
