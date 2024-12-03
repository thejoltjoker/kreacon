import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { rules } from './rule';

export const categoriesToRules = pgTable(
	'categories_to_rules',
	{
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id),
		ruleId: integer('rule_id')
			.notNull()
			.references(() => rules.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.ruleId, t.categoryId] })
	})
);

export const categoriesToRulesRelations = relations(categoriesToRules, ({ one }) => ({
	category: one(categories, {
		fields: [categoriesToRules.categoryId],
		references: [categories.id]
	}),
	rule: one(rules, {
		fields: [categoriesToRules.ruleId],
		references: [rules.id]
	})
}));

export default categoriesToRules;
