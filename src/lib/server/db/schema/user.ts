import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { roleEnum, timestamps } from './shared';
import accounts from './account';
import reactions from './reaction';
import submissions from './submission';
import tickets from './ticket';
import votes from './vote';

export const users = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
	username: varchar({ length: 255 }).notNull().unique(),
	email: varchar({ length: 255 }).notNull().unique(),
	emailVerifiedAt: timestamp('email_verified_at', { mode: 'date' }),
	password: varchar({ length: 255 }).notNull(),
	role: roleEnum('role').notNull().default('user'),
	picture: varchar({ length: 255 }),
	...timestamps
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	submissions: many(submissions),
	votes: many(votes),
	reactions: many(reactions),
	tickets: many(tickets)
}));

export type User = InferSelectModel<typeof users>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type InsertUser = InferInsertModel<typeof users>;

export default users;
