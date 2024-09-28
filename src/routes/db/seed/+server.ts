import { seed } from '../../../lib/server/seeders/seed';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	await seed();
	return new Response('Seeding done');
};
