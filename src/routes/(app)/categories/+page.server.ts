import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const result = await db.query.categories.findMany({
		with: {
			categoriesToRules: {
				with: {
					rule: true
				}
			}
		},
		columns: {
			id: true,
			name: true,
			mediaType: true,
			description: true
		}
	});
	return { categories: result };
}) satisfies PageServerLoad;
