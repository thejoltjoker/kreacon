import { db } from '$lib/server/db';
import { submissions, type InsertSubmission } from '$lib/server/db/schema';

export const seedSubmissions = async () => {
	const values: InsertSubmission[] = [
		{
			id: 'HeartfeltTastyMeerkat',
			userId: '3dca8a6c-9604-4a7a-90c2-177c4b7d2a31',
			categoryId: 1,
			eventId: 1,
			title: 'Neon Pulse: A Cyberpunk Journey',
			mediaId: 1
		},
		{
			id: 'SympatheticSoftLeopard',
			userId: '3dca8a6c-9604-4a7a-90c2-177c4b7d2a31',
			categoryId: 2,
			eventId: 1,
			title: 'Retro Reverie: 8-bit Nostalgia',
			mediaId: 2
		},
		{
			id: 'WickedTastyMammoth',
			userId: '3dca8a6c-9604-4a7a-90c2-177c4b7d2a31',
			categoryId: 3,
			eventId: 1,
			title: 'Fractal Symphony: A Mathematical Odyssey',
			mediaId: 3
		}
	];
	await db.insert(submissions).values(values).onConflictDoNothing();
};
