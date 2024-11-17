import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import categoriesToEvents from './categoriesToEvents';
import { mediaTypeEnum, timestamps } from './shared';
import { submissions } from './submission';

export const categories = pgTable('category', {
	id: serial().primaryKey(),
	name: text().notNull(),
	description: varchar({ length: 512 }),
	allowedMediaType: mediaTypeEnum('allowed_media_type'),
	...timestamps
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	categoriesToEvents: many(categoriesToEvents),
	submissions: many(submissions)
}));

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

export default categories;
