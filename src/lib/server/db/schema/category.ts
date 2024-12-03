import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import categoriesToEvents from './categoriesToEvents';
import categoriesToRules from './categoriesToRules';
import { mediaTypeEnum, timestamps } from './shared';
import { submissions } from './submission';

export const categories = pgTable('category', {
	id: serial().primaryKey(),
	name: text().notNull(),
	description: text().notNull(),
	mediaType: mediaTypeEnum('media_type').notNull(),
	...timestamps
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	categoriesToEvents: many(categoriesToEvents),
	categoriesToRules: many(categoriesToRules),
	submissions: many(submissions)
}));

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

export default categories;
