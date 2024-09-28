import { randomString } from '../../helpers/randomString';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, pgEnum, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

// General
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const mediaTypeEnum = pgEnum('mediaType', ['image', 'video', 'audio']);

// Users
export const users = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('username').unique(),
	email: text('email').unique(),
	emailVerifiedAt: timestamp('email_verified_at', { mode: 'date' }),
	password: text('password'),
	role: roleEnum('role').default('user'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	submissions: many(submissions),
	votes: many(votes),
	reactions: many(reactions),
	tickets: many(tickets)
}));

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
// Accounts

export const accounts = pgTable(
	'account',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export type Account = InferSelectModel<typeof accounts>;
export type InsertAccount = InferInsertModel<typeof accounts>;

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

export const sessions = pgTable('session', {
	sessionToken: text('session_token').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Session = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;

// Events

export const events = pgTable('event', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	submissionsOpenAt: timestamp('submissions_open_at', { mode: 'date' }).notNull(),
	submissionsCloseAt: timestamp('submissions_close_at', { mode: 'date' }).notNull(),
	votingOpenAt: timestamp('voting_open_at', { mode: 'date' }).notNull(),
	votingCloseAt: timestamp('voting_close_at', { mode: 'date' }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Event = InferSelectModel<typeof events>;
export type InsertEvent = InferInsertModel<typeof events>;
export const eventsRelations = relations(events, ({ many }) => ({
	categoriesToEvents: many(categoriesToEvents),
	submissions: many(submissions),
	tickets: many(tickets)
}));

export const tickets = pgTable('tickets', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id'),
	eventId: integer('event_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Ticket = InferSelectModel<typeof tickets>;
export type InsertTicket = InferInsertModel<typeof tickets>;

export const ticketsRelations = relations(tickets, ({ one }) => ({
	user: one(users, {
		fields: [tickets.userId],
		references: [users.id]
	}),
	event: one(events, {
		fields: [tickets.eventId],
		references: [events.id]
	})
}));

// Categories

export const categories = pgTable('category', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	allowedMediaType: mediaTypeEnum('allowed_media_type'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	categoriesToEvents: many(categoriesToEvents),
	submissions: many(submissions)
}));

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

// Categories to Events

export const categoriesToEvents = pgTable(
	'categories_to_events',
	{
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		eventId: integer('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.eventId, t.categoryId] })
	})
);

export const categoriesToEventsRelations = relations(categoriesToEvents, ({ one }) => ({
	category: one(categories, {
		fields: [categoriesToEvents.categoryId],
		references: [categories.id]
	}),
	event: one(events, {
		fields: [categoriesToEvents.eventId],
		references: [events.id]
	})
}));

// Submissions

export const submissions = pgTable('submission', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomString()),
	userId: text('user_id'),
	categoryId: integer('category_id'),
	eventId: integer('event_id'),
	title: text('title'),
	mediaId: integer('media_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
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

// Votes

export const votes = pgTable('vote', {
	id: serial('id').primaryKey(),
	name: text('name'),
	submissionId: text('submission_id'),
	userId: text('user_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Vote = InferSelectModel<typeof votes>;
export type InsertVote = InferInsertModel<typeof votes>;

export const votesRelations = relations(votes, ({ one }) => ({
	user: one(users, { fields: [votes.userId], references: [users.id] }),
	submission: one(submissions, {
		fields: [votes.submissionId],
		references: [submissions.id]
	})
}));

// Reactions

export const reactions = pgTable('reaction', {
	id: serial('id').primaryKey(),
	value: text('name'),
	userId: text('user_id'),
	submissionId: text('submission_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Reaction = InferSelectModel<typeof reactions>;
export type InsertReaction = InferInsertModel<typeof reactions>;

export const reactionsRelations = relations(reactions, ({ one }) => ({
	user: one(users, {
		fields: [reactions.userId],
		references: [users.id]
	}),
	submission: one(submissions, {
		fields: [reactions.submissionId],
		references: [submissions.id]
	})
}));

// Media

export const media = pgTable('media', {
	id: serial('id').primaryKey(),
	submissionId: text('submission_id'),
	type: mediaTypeEnum('type').notNull(),
	url: text('url').notNull(),
	alt: text('alt'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Media = InferSelectModel<typeof media>;
export type InsertMedia = InferInsertModel<typeof media>;

export const mediaRelations = relations(media, ({ one }) => ({
	submission: one(submissions, {
		fields: [media.submissionId],
		references: [submissions.id]
	})
}));
