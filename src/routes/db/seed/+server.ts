import { randomTestString } from '$lib/helpers/randomString';
import { seed } from '../../../lib/server/seeders/seed';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	await seed();
	const ids = Array.from({ length: 30 }, () => randomTestString());
	return new Response('Seeding done\n// ' + ids.join('\n// '));
};
