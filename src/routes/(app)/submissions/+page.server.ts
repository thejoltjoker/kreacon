import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const submissions = await db.query.submissions.findMany({
		with: {
			user: true,
			media: true,
			reactions: true,
			category: true
		}
	});
	const categories = await db.query.categories.findMany();
	console.log(submissions);
	return { submissions: submissions, categories: categories };
}) satisfies PageServerLoad;
