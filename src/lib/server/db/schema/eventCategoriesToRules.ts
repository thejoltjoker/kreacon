import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import eventCategories from './eventCategory';
import { rules } from './rule';

export const eventCategoriesToRules = pgTable(
	'event_categories_to_rules',
	{
		eventCategoryId: integer('event_category_id')
			.notNull()
			.references(() => eventCategories.id),
		ruleId: integer('rule_id')
			.notNull()
			.references(() => rules.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.ruleId, t.eventCategoryId] })
	})
);

export const eventCategoriesToRulesRelations = relations(eventCategoriesToRules, ({ one }) => ({
	eventCategory: one(eventCategories, {
		fields: [eventCategoriesToRules.eventCategoryId],
		references: [eventCategories.id]
	}),
	rule: one(rules, {
		fields: [eventCategoriesToRules.ruleId],
		references: [rules.id]
	})
}));

export default eventCategoriesToRules;
