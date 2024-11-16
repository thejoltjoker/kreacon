import { randomString } from '@/lib/helpers/randomString';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import type { User, Vote } from 'lucide-svelte';
import categories, { type Category } from './category';
import events from './event';
import media, { type Media } from './media';
import reactions, { type Reaction } from './reaction';
import { timestamps } from './shared';
import users from './user';
import { votes } from './vote';

export const submissions = pgTable('submission', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => randomString()),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: integer('category_id').notNull(),
	eventId: integer('event_id').notNull(),
	title: varchar('title').notNull(),
	mediaId: integer('media_id').notNull(),
	...timestamps
});

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
	user: one(users, {
		fields: [submissions.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [submissions.categoryId],
		references: [categories.id]
	}),
	event: one(events, {
		fields: [submissions.eventId],
		references: [events.id]
	}),
	reactions: many(reactions),
	votes: many(votes),
	media: one(media, {
		fields: [submissions.mediaId],
		references: [media.id]
	})
}));

export type Submission = InferSelectModel<typeof submissions>;
export type InsertSubmission = InferInsertModel<typeof submissions>;
export type SubmissionWithCategoryMediaReactionsUserVotes = InferSelectModel<typeof submissions> & {
	category: Category;
	media: Media[];
	reactions: Reaction[];
	user: User;
	votes: Vote[];
};

export default submissions;
