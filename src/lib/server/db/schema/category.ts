import { isValidMediaType } from '$lib/helpers/mediaTypes';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import eventCategories from './eventCategory';
import { mediaTypeEnum, timestamps } from './shared';
import { submissions } from './submission';

export const categories = pgTable('category', {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 300 }).notNull().unique(),
	description: text().notNull(),
	mediaType: mediaTypeEnum('media_type').notNull(),
	...timestamps
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	eventCategories: many(eventCategories),
	submissions: many(submissions)
}));

export const insertCategorySchema = createInsertSchema(categories).extend({
	mediaType: z.string().refine((value) => isValidMediaType(value), {
		message: 'Invalid media type'
	}),
	name: z.string().min(1, { message: 'Name is required' }).max(255, { message: 'Name is too long' })
});
export const selectCategorySchema = createSelectSchema(categories);

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

export default categories;
