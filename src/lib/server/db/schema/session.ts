import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import users from './user';
import { timestamps } from './shared';

export const sessions = pgTable('session', {
	sessionToken: varchar({ length: 255 }).primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	...timestamps
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export type Session = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;

export default sessions;
