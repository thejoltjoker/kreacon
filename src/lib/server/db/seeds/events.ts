import { db } from '../../db';
import * as schema from '../../db/schema';
import data from './data/events.json';
import { eq } from 'drizzle-orm';

const getOrCreateRule = async (text: string) => {
	const rule = await db.query.rules.findFirst({
		where: eq(schema.rules.text, text)
	});

	if (rule) {
		return rule.id;
	}

	const [insertedRule] = await db
		.insert(schema.rules)
		.values({ text })
		.onConflictDoUpdate({ target: schema.rules.id, set: { text } })
		.returning();
	return insertedRule.id;
};

const getCategoryId = async (db: db, categoryName: string) => {
	const category = await db.query.categories.findFirst({
		where: eq(schema.categories.name, categoryName)
	});
	if (!category) {
		throw new Error('Unknown category: ' + categoryName);
	}
	return category.id;
};

const getUserId = async (db: db, username: string) => {
	const user = await db.query.users.findFirst({
		where: eq(schema.users.username, username)
	});
	if (!user) {
		throw new Error('Unknown user: ' + username);
	}
	return user.id;
};

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (event) => {
			const [insertedEvent] = await db
				.insert(schema.events)
				.values({
					...event,
					submissionsOpenAt: new Date(event.submissionsOpenAt),
					submissionsCloseAt: new Date(event.submissionsCloseAt),
					votingOpenAt: new Date(event.votingOpenAt),
					votingCloseAt: new Date(event.votingCloseAt)
				})
				.returning();

			await Promise.all(
				event.categories?.map(async (category) => {
					const categoryId = await getCategoryId(db, category.name);
					const [insertedEventCategory] = await db
						.insert(schema.eventCategories)
						.values({
							categoryId,
							eventId: insertedEvent.id
						})
						.returning();

					await Promise.all(
						category.rules?.map(async (rule) => {
							const ruleId = await getOrCreateRule(rule.text);
							await db.insert(schema.eventCategoriesToRules).values({
								eventCategoryId: insertedEventCategory.id,
								ruleId
							});
						})
					);
				})
			);

			await Promise.all(
				event.tickets?.map(async (ticket) => {
					const userId = await getUserId(db, ticket.username);
					await db.insert(schema.tickets).values({
						userId,
						eventId: insertedEvent.id
					});
				})
			);
		})
	);
};
export default seed;
