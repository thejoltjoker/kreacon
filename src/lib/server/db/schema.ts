import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, pgEnum, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
export const roleEnum = pgEnum('role', ['user', 'admin']);

export const users = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('username').unique(),
	email: text('email').unique(),
	emailVerifiedAt: timestamp('emailVerifiedAt', { mode: 'date' }),
	password: text('password'),
	role: roleEnum('role').default('user'),
	image: text('image'),
	ticket: text('ticket'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	submissions: many(submissions),
	votes: many(votes),
	reactions: many(reactions)
}));

export type User = InferSelectModel<typeof users>;

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		createdAt: timestamp('createdAt').defaultNow(),
		updatedAt: timestamp('updatedAt')
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Session = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;

export const events = pgTable('event', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	submissionsOpenAt: timestamp('submissionsOpenAt', { mode: 'date' }).notNull(),
	submissionsCloseAt: timestamp('submissionsCloseAt', { mode: 'date' }).notNull(),
	votingOpenAt: timestamp('votingOpenAt', { mode: 'date' }).notNull(),
	votingCloseAt: timestamp('votingCloseAt', { mode: 'date' }).notNull(),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export type Event = InferSelectModel<typeof events>;

export const eventsRelations = relations(events, ({ many }) => ({
	categoriesToEvents: many(categoriesToEvents),
	submissions: many(submissions)
}));

export const categories = pgTable('category', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	categoriesToEvents: many(categoriesToEvents),
	submissions: many(submissions)
}));

export const categoriesToEvents = pgTable(
	'categories_to_events',
	{
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id),
		eventId: integer('event_id')
			.notNull()
			.references(() => events.id)
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

export const submissions = pgTable('submission', {
	id: serial('id').primaryKey(),
	name: text('name'),
	userId: text('user_id'),
	categoryId: integer('category_id'),
	eventId: integer('event_id'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
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
	votes: many(votes)
}));

export const votes = pgTable('vote', {
	id: serial('id').primaryKey(),
	name: text('name'),
	submissionId: integer('submission_id'),
	userId: text('user_id'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const votesRelations = relations(votes, ({ one }) => ({
	user: one(users, { fields: [votes.userId], references: [users.id] }),
	submission: one(submissions, {
		fields: [votes.submissionId],
		references: [submissions.id]
	})
}));

export const reactions = pgTable('reaction', {
	id: serial('id').primaryKey(),
	value: text('name'),
	userId: text('user_id'),
	submissionId: integer('submission_id'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

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
