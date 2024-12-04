import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import eventCategories from './eventCategory';
import { timestamps } from './shared';

export const prizes = pgTable('prize', {
	id: serial().primaryKey(),
	text: text().notNull(),
	position: integer('position').notNull(),
	categoryId: integer('category_id'),
	...timestamps
});

export const prizesRelations = relations(prizes, ({ one }) => ({
	category: one(eventCategories, {
		fields: [prizes.categoryId],
		references: [eventCategories.id]
	})
}));

export type Prize = InferSelectModel<typeof prizes>;
export type InsertPrize = InferInsertModel<typeof prizes>;

export default prizes;
