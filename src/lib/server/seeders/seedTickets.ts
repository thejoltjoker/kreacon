import { db } from '$lib/server/db';
import { tickets, type InsertTicket } from '$lib/server/db/schema';

export const seedTickets = async () => {
	const values: InsertTicket[] = [
		{
			id: '03dca3dd-bd2c-4ba6-a950-75a95268ca17',
			userId: '3dca8a6c-9604-4a7a-90c2-177c4b7d2a31',
			eventId: 1
		}
	];
	await db.insert(tickets).values(values).onConflictDoNothing();
};
