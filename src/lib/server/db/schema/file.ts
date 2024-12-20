import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from './shared';

export const files = pgTable('file', {
	id: uuid().defaultRandom().primaryKey(),
	category: varchar({ length: 255 }),
	contentType: varchar({ length: 127 }).notNull(),
	container: varchar({ length: 255 }),
	url: varchar({ length: 255 }).notNull(),
	filename: varchar({ length: 255 }).notNull(),
	size: integer(),
	checksum: varchar({ length: 255 }),
	metadata: jsonb(),
	...timestamps
});

export const selectFileSchema = createSelectSchema(files);
export const insertFileSchema = createInsertSchema(files);
export const updateFileSchema = insertFileSchema.partial();

export type SelectFile = InferSelectModel<typeof files>;
export type InsertFile = InferInsertModel<typeof files>;

export default files;
