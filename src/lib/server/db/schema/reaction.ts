import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import users from './user';
import { submissions } from './submission';

export const reactions = pgTable('reaction', {
	id: serial().primaryKey(),
	value: varchar({ length: 255 }).notNull(),
	userId: uuid('user_id').notNull(),
	submissionId: varchar({ length: 255 }).notNull(),
	...timestamps
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

export type Reaction = InferSelectModel<typeof reactions>;
export type InsertReaction = InferInsertModel<typeof reactions>;

export default reactions;
