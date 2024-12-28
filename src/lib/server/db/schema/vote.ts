import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import entries from './entry';
import users from './user';
import { createInsertSchema } from 'drizzle-zod';

export const votes = pgTable(
	'vote',
	{
		entryId: varchar('entry_id')
			.notNull()
			.references(() => entries.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(t) => ({
		pk: primaryKey({ columns: [t.entryId, t.userId] })
	})
);

export const votesRelations = relations(votes, ({ one }) => ({
	user: one(users, { fields: [votes.userId], references: [users.id] }),
	entries: one(entries, {
		fields: [votes.entryId],
		references: [entries.id]
	})
}));

export const insertVoteSchema = createInsertSchema(votes);

export type Vote = InferSelectModel<typeof votes>;
export type InsertVote = InferInsertModel<typeof votes>;

export default votes;
