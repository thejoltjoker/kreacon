import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { index, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { randomString } from '../../../helpers/randomString';
import categories, { type Category } from './category';
import events from './event';
import { files } from './file';
import media, { type Media } from './media';
import reactions from './reaction';
import { submissionStatusEnum, timestamps } from './shared';
import tickets from './ticket';
import users from './user';
import { votes } from './vote';

export const submissions = pgTable(
	'submission',
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
		status: submissionStatusEnum('status').notNull().default('draft'),
		title: varchar({ length: 255 }).notNull(),
		views: integer().notNull().default(0),
		// TODO Add license https://creativecommons.org/share-your-work/cclicenses/
		// license: varchar({ length: 255 }).notNull(),
		// Files
		mediaId: integer('media_id').notNull(),
		thumbnailId: integer('thumbnail_id').notNull(),
		proofId: uuid('proof_id'),
		...timestamps
	},
	(table) => ({
		searchIndex: index('submissions_search_idx').using(
			'gin',
			sql`to_tsvector('english', ${table.title})`
		)
	})
);

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
	user: one(users, {
		fields: [submissions.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [submissions.categoryId],
		references: [categories.id]
	}),
	ticket: one(tickets, {
		fields: [submissions.ticketId],
		references: [tickets.id]
	}),
	event: one(events, {
		fields: [submissions.eventId],
		references: [events.id]
	}),
	reactions: many(reactions),
	votes: many(votes),
	media: one(files, {
		fields: [submissions.mediaId],
		references: [files.id]
	}),
	thumbnail: one(files, {
		fields: [submissions.thumbnailId],
		references: [files.id]
	}),
	proof: one(files, {
		fields: [submissions.proofId],
		references: [files.id]
	})
}));

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
	views: true,
	createdAt: true,
	updatedAt: true,
	id: true
});
export const updateSubmissionSchema = insertSubmissionSchema.partial();
export const selectSubmissionSchema = createSelectSchema(submissions);

export type Submission = InferSelectModel<typeof submissions>;
export type SubmissionWithCategoryMediaThumbnail = InferSelectModel<typeof submissions> & {
	category: Category;
	media: Media;
	thumbnail: Media;
};
export type InsertSubmission = InferInsertModel<typeof submissions>;

export default submissions;
