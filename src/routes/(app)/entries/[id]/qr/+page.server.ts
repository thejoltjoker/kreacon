import { db } from '$lib/server/db';
import { entries } from '$lib/server/db/schema';
import { createBackendLogger } from '$lib/server/logger';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
const logger = createBackendLogger('/entries/[id]');
export const load = (async ({ params, locals }) => {
	const { id } = params;
	logger.info(`Loading entry with ID: ${id}`);

	const result = await db.query.entries.findFirst({
		where: eq(entries.id, id),
		columns: {
			id: true,
			title: true
		}
	});

	if (!result) {
		logger.warn(`Entry with ID: ${id} not found`);
	}

	return { entry: result };
}) satisfies PageServerLoad;
