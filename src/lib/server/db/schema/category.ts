import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import eventCategories from './eventCategory';
import { mediaTypeEnum, timestamps } from './shared';
import { submissions } from './submission';

export const categories = pgTable('category', {
	id: serial().primaryKey(),
	name: text().notNull(),
	slug: text().notNull().unique(),
	description: text().notNull(),
	mediaType: mediaTypeEnum('media_type').notNull(),
	...timestamps
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	eventCategories: many(eventCategories),
	submissions: many(submissions)
}));

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

export default categories;
