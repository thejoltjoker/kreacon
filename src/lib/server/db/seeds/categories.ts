import { db } from '$lib/server/db';
import { categories, categoriesToEvents, type InsertCategory } from '$lib/server/db/schema';

export const seedCategories = async () => {
	const values: InsertCategory[] = [
		{
			id: 1,
			name: 'Combined Demo',
			description:
				'A comprehensive demo combining various elements like graphics, music, and animation.'
		},
		{
			id: 2,
			name: 'Prerendered Music',
			description:
				'Music created using prerendered techniques, often with high-quality production values.'
		},
		{
			id: 3,
			name: 'Tracked Music',
			description:
				'Music created using tracking software, often with a distinct retro or chiptune sound.'
		},
		{
			id: 4,
			name: 'Freestyle Graphics',
			description: 'Unrestricted graphical creations showcasing artistic freedom and creativity.'
		},
		{
			id: 5,
			name: 'Oldschool Graphics',
			description:
				'Graphics created in the style of or using techniques from earlier computing eras.'
		},
		{
			id: 6,
			name: 'Freestyle Photo',
			description: 'Unrestricted photographic entries allowing for creative expression and editing.'
		},
		{
			id: 7,
			name: 'Stop Motion',
			description:
				'Animations created using stop motion techniques, bringing static objects to life.'
		},
		{
			id: 8,
			name: 'Wild / Animation',
			description: "A catch-all category for animations and other entries that don't fit elsewhere."
		}
	];
	const inserted = await db.insert(categories).values(values).onConflictDoNothing().returning();
	if (inserted.length === 0) return;
	await db
		.insert(categoriesToEvents)
		.values(inserted.map((v) => ({ categoryId: v.id, eventId: 1 })))
		.onConflictDoNothing();
};
