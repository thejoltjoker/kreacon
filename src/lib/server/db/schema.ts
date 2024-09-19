import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	password: text('password'),
	role: text('role').default('user'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
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
