import { db } from '$lib/server/db';
import { votes, type InsertVote } from '$lib/server/db/schema';

export const seedVotes = async () => {
	const values: InsertVote[] = [
		{
			submissionId: 'HeartfeltTastyMeerkat',
			userId: '726a0536-c092-4e47-807d-7b6118e821ea'
		},
		{
			submissionId: 'HeartfeltTastyMeerkat',
			userId: 'eb86c861-9302-4712-a3b2-3bc0e74be482'
		},
		{
			submissionId: 'HeartfeltTastyMeerkat',
			userId: '3d115b8f-9be0-4937-b3d9-5576919568b4'
		}
	];
	await db.insert(votes).values(values).onConflictDoNothing();
};
