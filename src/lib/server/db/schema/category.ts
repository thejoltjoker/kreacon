import { isValidMediaType } from '../../../helpers/mediaTypes';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import eventCategories from './eventCategory';
import { mediaTypeEnum, timestamps } from './shared';
import { entries } from './entry';

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
	entries: many(entries)
}));

export const insertCategorySchema = createInsertSchema(categories).extend({
	mediaType: z.string().refine((value) => isValidMediaType(value), {
		message: 'Invalid media type'
	}),
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(255, { message: 'Name is too long' }),
	description: z.string().min(1, { message: 'Description is required' }),
	slug: z
		.string()
		.min(1, { message: 'Slug is required' })
		.max(300, { message: 'Slug is too long' })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message: 'Slug must be in kebab-case format (lowercase letters, numbers, and hyphens only)'
		})
});
export const selectCategorySchema = createSelectSchema(categories);

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

export default categories;
