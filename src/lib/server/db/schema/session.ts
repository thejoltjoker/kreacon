import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import users from './user';
import { timestamps } from './shared';

export const sessions = pgTable('session', {
	id: varchar({ length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
	...timestamps
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export type Session = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;
export default sessions;
