import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared';
import users from './user';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

export const accounts = pgTable(
	'account',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: varchar({ length: 255 }).notNull(),
		providerAccountId: varchar('provider_account_id').notNull(),
		...timestamps
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

export type Account = InferSelectModel<typeof accounts>;
export type InsertAccount = InferInsertModel<typeof accounts>;

export default accounts;
