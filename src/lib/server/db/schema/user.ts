import { passwordSchema } from '$lib/schemas/passwordSchema';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import accounts from './account';
import reactions from './reaction';
import { roleEnum, timestamps } from './shared';
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

export const insertUserSchema = createInsertSchema(users, {
	username: (schema) =>
		schema.username
			.min(1, { message: 'Username is required' })
			.max(255, { message: 'Username is too long' })
			.refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
				message: 'Username can only contain letters, numbers, and underscores'
			}),
	email: (schema) =>
		schema.email
			.email({ message: 'Invalid email address' })
			.max(255, { message: 'Email is too long' }),
	password: passwordSchema
}).pick({
	username: true,
	email: true,
	password: true,
	picture: true
});

export const updateUserSchema = insertUserSchema.partial();

export const selectUserSchema = createSelectSchema(users);

export type User = InferSelectModel<typeof users>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type InsertUser = InferInsertModel<typeof users>;

export default users;
