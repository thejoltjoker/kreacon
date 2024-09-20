import { integer, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
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
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password.min(8),
	role: z.enum(['user', 'admin'])
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
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

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});
