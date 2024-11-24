import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import { submissions } from './submission';
import users from './user';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const reactions = pgTable(
	'reaction',
	{
		value: varchar('value', { length: 16 }).notNull(),
		userId: uuid('user_id').notNull(),
		submissionId: varchar('submission_id', { length: 255 }).notNull(),
		...timestamps
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.submissionId] })
	})
);

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

export const insertReactionSchema = createInsertSchema(reactions, {
	value: z.string().emoji()
});

export type Reaction = InferSelectModel<typeof reactions>;
export type InsertReaction = InferInsertModel<typeof reactions>;

export default reactions;
