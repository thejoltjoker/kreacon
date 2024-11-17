import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { events } from './event';

export const categoriesToEvents = pgTable(
	'categories_to_events',
	{
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id),
		eventId: integer('event_id')
			.notNull()
			.references(() => events.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.eventId, t.categoryId] })
	})
);

export const categoriesToEventsRelations = relations(categoriesToEvents, ({ one }) => ({
	category: one(categories, {
		fields: [categoriesToEvents.categoryId],
		references: [categories.id]
	}),
	event: one(events, {
		fields: [categoriesToEvents.eventId],
		references: [events.id]
	})
}));

export default categoriesToEvents;
