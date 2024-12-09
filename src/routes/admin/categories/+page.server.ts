import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const categories = await db.query.categories.findMany();

	return { categories, title: { text: 'Categories', href: '/admin/categories' } };
}) satisfies PageServerLoad;
