import { db } from '$lib/server/db';
import { reactions, type InsertReaction } from '$lib/server/db/schema';

export const seedReactions = async () => {
	const values: InsertReaction[] = [
		{
			id: 1,
			submissionId: 'HeartfeltTastyMeerkat',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea',
			value: '❤️'
		},
		{
			id: 2,
			submissionId: 'HeartfeltTastyMeerkat',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			value: '🔥'
		}
	];
	await db.insert(reactions).values(values).onConflictDoNothing();
};
