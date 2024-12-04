import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { events } from './event';
import rules from './rule';

export const eventCategories = pgTable(
	'event_category',
	{
		id: serial('id').primaryKey(),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id),
		eventId: integer('event_id')
			.notNull()
			.references(() => events.id)
	},
	(t) => ({
		uniqueConstraint: unique().on(t.eventId, t.categoryId)
	})
);

export const eventCategoriesRelations = relations(eventCategories, ({ one, many }) => ({
	category: one(categories, {
		fields: [eventCategories.categoryId],
		references: [categories.id]
	}),
	event: one(events, {
		fields: [eventCategories.eventId],
		references: [events.id]
	}),
	rules: many(rules)
}));

export default eventCategories;
