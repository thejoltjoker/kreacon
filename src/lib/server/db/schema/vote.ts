import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import submissions from './submission';
import users from './user';

export const votes = pgTable(
	'vote',
	{
		submissionId: varchar('submission_id')
			.notNull()
			.references(() => submissions.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(t) => ({
		pk: primaryKey({ columns: [t.submissionId, t.userId] })
	})
);

export type Vote = InferSelectModel<typeof votes>;
export type InsertVote = InferInsertModel<typeof votes>;

export const votesRelations = relations(votes, ({ one }) => ({
	user: one(users, { fields: [votes.userId], references: [users.id] }),
	submission: one(submissions, {
		fields: [votes.submissionId],
		references: [submissions.id]
	})
}));

export default votes;
