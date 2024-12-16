import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { mediaTypeEnum, timestamps } from './shared';

export const media = pgTable('media', {
	id: serial().primaryKey(),
	type: mediaTypeEnum('type').notNull(),
	url: varchar({ length: 255 }).notNull(),
	filename: varchar({ length: 255 }).notNull(),
	alt: varchar({ length: 255 }),
	...timestamps
});

export type Media = InferSelectModel<typeof media>;
export type InsertMedia = InferInsertModel<typeof media>;

export default media;
