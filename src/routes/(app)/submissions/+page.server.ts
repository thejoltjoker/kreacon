import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const submissions = await db.query.submissions.findMany({
		with: {
			user: true,
			media: true,
			reactions: true,
			category: true
		}
	});
	const categories = await db.query.categories.findMany();
	return { submissions: submissions, categories: categories, user: locals.user };
}) satisfies PageServerLoad;
