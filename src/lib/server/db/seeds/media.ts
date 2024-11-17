import { db } from '../../db';
import * as schema from '../../db/schema';
import data from './data/media.json';
import { eq } from 'drizzle-orm';

async function getSubmissionId(db: db, submissionId: string) {
	const submission = await db.query.submissions.findFirst({
		where: eq(schema.submissions.id, submissionId)
	});
	if (!submission) {
		throw new Error('Unknown submission: ' + submissionId);
	}
	return submission.id;
}

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (item) => {
			await db
				.insert(schema.media)
				.values({
					...item,
					submissionId: await getSubmissionId(db, item.submissionId)
				})
				.returning();
		})
	);
};
export default seed;
