import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { index, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { randomString } from '../../../helpers/randomString';
import categories, { type Category } from './category';
import events from './event';
import { files } from './file';
import { type Media } from './media';
import reactions from './reaction';
import { licenseEnum, entryStatusEnum, timestamps } from './shared';
import tickets from './ticket';
import users from './user';
import { votes } from './vote';

export const entries = pgTable(
	'entry',
	{
		id: varchar('id')
			.primaryKey()
			.$defaultFn(() => randomString()),
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		categoryId: integer('category_id').notNull(),
		eventId: integer('event_id').notNull(),
		ticketId: varchar('ticket_id', { length: 255 }).notNull(),
		status: entryStatusEnum('status').notNull().default('draft'),
		title: varchar({ length: 255 }).notNull(),
		description: varchar({ length: 1024 }),
		views: integer().notNull().default(0),
		license: licenseEnum('license').notNull(),
		// Files
		mediaId: uuid('media_id').notNull(),
		thumbnailId: uuid('thumbnail_id'), // Stale for now
		previewId: uuid('preview_id').notNull(),
		proofId: uuid('proof_id'),
		...timestamps
	},
	(table) => ({
		searchIndex: index('entrys_search_idx').using(
			'gin',
			sql`to_tsvector('english', ${table.title})`
		)
	})
);

export const entriesRelations = relations(entries, ({ one, many }) => ({
	user: one(users, {
		fields: [entries.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [entries.categoryId],
		references: [categories.id]
	}),
	ticket: one(tickets, {
		fields: [entries.ticketId],
		references: [tickets.id]
	}),
	event: one(events, {
		fields: [entries.eventId],
		references: [events.id]
	}),
	reactions: many(reactions),
	votes: many(votes),
	media: one(files, {
		fields: [entries.mediaId],
		references: [files.id]
	}),
	thumbnail: one(files, {
		fields: [entries.thumbnailId],
		references: [files.id]
	}),
	preview: one(files, {
		fields: [entries.previewId],
		references: [files.id]
	}),
	proof: one(files, {
		fields: [entries.proofId],
		references: [files.id]
	})
}));

export const insertEntrySchema = createInsertSchema(entries).omit({
	views: true,
	createdAt: true,
	updatedAt: true,
	id: true
});
export const updateEntrySchema = insertEntrySchema.partial();
export const selectEntrySchema = createSelectSchema(entries);

export type Entry = InferSelectModel<typeof entries>;
export type EntryWithCategoryMediaThumbnail = InferSelectModel<typeof entries> & {
	category: Category;
	media: Media;
	thumbnail: Media;
};
export type InsertEntry = InferInsertModel<typeof entries>;

export default entries;
