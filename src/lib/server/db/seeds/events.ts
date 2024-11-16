import { db } from '$lib/server/db';
import { events, type InsertEvent } from '$lib/server/db/schema';

export const seedEvents = async () => {
	const values: InsertEvent[] = [
		{
			id: 1,
			name: 'Beacon Summer 2025',
			description:
				'Join us for an epic LAN party at Beacon Summer 2025! Experience non-stop gaming, thrilling tournaments, cosplay contests, tech workshops, and delicious food. Connect with fellow gamers, win exciting prizes, and create unforgettable memories in this action-packed event.',
			submissionsOpenAt: new Date('2025-06-01T00:00:00Z'),
			submissionsCloseAt: new Date('2025-06-15T23:59:59Z'),
			votingOpenAt: new Date('2025-06-16T00:00:00Z'),
			votingCloseAt: new Date('2025-06-30T23:59:59Z')
		},
		{
			id: 2,
			name: 'Beacon Winter 2025',
			description:
				'Embrace the chill at Beacon Winter 2025! Our cozy LAN party features indoor gaming marathons, frosty-themed tournaments, winter cosplay contests, tech workshops by the fireplace, and warm comfort food. Connect with fellow gamers, compete for cool prizes, and create lasting memories in this winter wonderland of gaming.',
			submissionsOpenAt: new Date('2025-12-01T00:00:00Z'),
			submissionsCloseAt: new Date('2025-12-15T23:59:59Z'),
			votingOpenAt: new Date('2025-12-16T00:00:00Z'),
			votingCloseAt: new Date('2025-12-30T23:59:59Z')
		}
	];
	await db.insert(events).values(values).onConflictDoNothing();
};
