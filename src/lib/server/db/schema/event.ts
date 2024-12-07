import { type InferInsertModel, type InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import eventCategories from './eventCategory';
import rules from './rule';
import { timestamps } from './shared';
import { submissions } from './submission';
import { tickets } from './ticket';

export const events = pgTable(
	'event',
	{
		id: serial('id').primaryKey(),
		name: varchar({ length: 255 }).notNull(),
		slug: varchar({ length: 255 }).notNull().unique(),
		description: varchar({ length: 512 }),
		submissionsOpenAt: timestamp('submissions_open_at', { mode: 'date' }).notNull(),
		submissionsCloseAt: timestamp('submissions_close_at', { mode: 'date' }).notNull(),
		votingOpenAt: timestamp('voting_open_at', { mode: 'date' }).notNull(),
		votingCloseAt: timestamp('voting_close_at', { mode: 'date' }).notNull(),
		...timestamps
	},
	(table) => ({
		searchIndex: index('events_search_idx').using(
			'gin',
			sql`to_tsvector('english', ${table.name} || ' ' || ${table.description})`
		)
	})
);

export const eventsRelations = relations(events, ({ many }) => ({
	eventCategories: many(eventCategories),
	submissions: many(submissions),
	tickets: many(tickets),
	rules: many(rules)
}));

export type Event = InferSelectModel<typeof events>;
export type InsertEvent = InferInsertModel<typeof events>;

export default events;
