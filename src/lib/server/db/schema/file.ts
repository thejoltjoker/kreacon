import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from './shared';

export const files = pgTable('file', {
	id: uuid().defaultRandom().primaryKey(),
	type: varchar({ length: 127 }).notNull(),
	url: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	size: integer().notNull(),
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
