import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import events from './event';
import eventCategories from './eventCategory';
import { timestamps } from './shared';

export const rules = pgTable('rule', {
	id: serial().primaryKey(),
	text: text().notNull(),
	eventId: integer('event_id'),
	categoryId: integer('category_id'),
	...timestamps
});

export const rulesRelations = relations(rules, ({ one }) => ({
	category: one(eventCategories, {
		fields: [rules.categoryId],
		references: [eventCategories.id]
	}),
	event: one(events, {
		fields: [rules.eventId],
		references: [events.id]
	})
}));

export type Rule = InferSelectModel<typeof rules>;
export type InsertRule = InferInsertModel<typeof rules>;

export default rules;
