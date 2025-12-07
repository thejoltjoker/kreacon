import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import { entries } from './entry';
import users, { type PublicUser } from './user';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export const reactions = pgTable(
	'reaction',
	{
		value: varchar('value', { length: 16 }).notNull(),
		userId: uuid('user_id').notNull(),
		entryId: varchar('entry_id', { length: 255 }).notNull(),
		...timestamps
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.entryId] })
	})
);

export const reactionsRelations = relations(reactions, ({ one }) => ({
	user: one(users, {
		fields: [reactions.userId],
		references: [users.id]
	}),
	entry: one(entries, {
		fields: [reactions.entryId],
		references: [entries.id]
	})
}));

export const insertReactionSchema = createInsertSchema(reactions, {
	value: z.string().emoji()
}).extend({ createdAt: z.date().optional(), updatedAt: z.date().optional() });

export type SelectReaction = InferSelectModel<typeof reactions>;
export type SelectReactionWithPublicUser = SelectReaction & { user: PublicUser };
export type InsertReaction = InferInsertModel<typeof reactions>;

export default reactions;
