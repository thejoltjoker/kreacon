import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import eventCategoriesToRules from './eventCategoriesToRules';
import { timestamps } from './shared';

export const rules = pgTable('rule', {
	id: serial().primaryKey(),
	text: text().notNull(),
	isGeneral: boolean().notNull().default(false),
	...timestamps
});

export const rulesRelations = relations(rules, ({ many }) => ({
	categoriesToRules: many(eventCategoriesToRules)
}));

export type Rule = InferSelectModel<typeof rules>;
export type InsertRule = InferInsertModel<typeof rules>;

export default rules;
