import type { MediaType } from '$lib/types/mediaTypes';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import * as schema from '../../db/schema';
import data from './data/categories.json';

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

export const seed = async (db: db) => {
	// Create all unique rules first
	const uniqueRules = new Set(data.flatMap((category) => category.rules.map((rule) => rule.text)));
	const ruleIdMap = new Map<string, number>();

	await Promise.all(
		Array.from(uniqueRules).map(async (ruleText) => {
			const ruleId = await getOrCreateRule(ruleText);
			ruleIdMap.set(ruleText, ruleId);
		})
	);

	// Now insert categories and their rule associations
	await Promise.all(
		data.map(async (category) => {
			const ruleIds = category.rules.map((rule) => ruleIdMap.get(rule.text)!);

			const [insertedCategory] = await db
				.insert(schema.categories)
				.values({
					...category,
					mediaType: category.mediaType as MediaType
				})
				.returning();

			await db.insert(schema.categoriesToRules).values(
				ruleIds.map((ruleId) => ({
					categoryId: insertedCategory.id,
					ruleId
				}))
			);
		})
	);
};
export default seed;
