import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { registerUserSchema } from '../../../schemas/user';
import accounts from './account';
import reactions from './reaction';
import { roleEnum, timestamps } from './shared';
import entries from './entry';
import tickets from './ticket';
import votes from './vote';
import { z } from 'zod/v4';
import { userStatus } from '../../../types/userStatus';
import { userRoles } from '../../../types/userRoles';
import files from './file';

export const userStatusEnum = pgEnum('status', userStatus);
export const users = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
	username: varchar({ length: 255 }).notNull().unique(),
	email: varchar({ length: 255 }).notNull().unique(),
	emailVerifiedAt: timestamp('email_verified_at', { mode: 'date' }),
	password: varchar({ length: 255 }).notNull(),
	role: roleEnum('role').notNull().default('user'),
	avatarId: uuid('avatar_id'),
	status: userStatusEnum('status').notNull().default('active'),
	...timestamps
});

export const usersRelations = relations(users, ({ many, one }) => ({
	accounts: many(accounts),
	entries: many(entries),
	votes: many(votes),
	reactions: many(reactions),
	tickets: many(tickets),
	avatar: one(files, {
		fields: [users.avatarId],
		references: [files.id]
	})
}));

export const insertUserSchema = createInsertSchema(users).merge(registerUserSchema).pick({
	username: true,
	email: true,
	password: true
});

export const updateUserSchema = insertUserSchema
	.partial()
	.merge(z.object({ status: z.enum(userStatus), role: z.enum(userRoles) }));

export const selectUserSchema = createSelectSchema(users);

export type User = InferSelectModel<typeof users>;
export type PublicUser = Pick<User, 'username'> & {
	avatar: { url: string | undefined | null } | null | undefined;
};
export type UserWithoutPassword = Omit<User, 'password'>;
export type InsertUser = InferInsertModel<typeof users>;

export default users;
