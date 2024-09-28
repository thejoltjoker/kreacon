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
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			categoryId: 1,
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
		},
		{
			id: 'JuicyFastCat',
			userId: '3d115b8f-9be0-4937-b3d9-5576919568b4',
			categoryId: 1,
			eventId: 1,
			title: 'Cosmic Dreamscape: A Digital Voyage',
			mediaId: 4
		}
	];
	await db.insert(submissions).values(values).onConflictDoNothing();
};
