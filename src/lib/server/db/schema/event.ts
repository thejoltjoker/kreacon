import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import eventCategories from './eventCategory';
import { submissions } from './submission';
import { tickets } from './ticket';
import { timestamps } from './shared';

export const events = pgTable('event', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull().unique(),
	description: varchar({ length: 512 }),
	submissionsOpenAt: timestamp('submissions_open_at', { mode: 'date' }).notNull(),
	submissionsCloseAt: timestamp('submissions_close_at', { mode: 'date' }).notNull(),
	votingOpenAt: timestamp('voting_open_at', { mode: 'date' }).notNull(),
	votingCloseAt: timestamp('voting_close_at', { mode: 'date' }).notNull(),
	...timestamps
});

export type Event = InferSelectModel<typeof events>;
export type InsertEvent = InferInsertModel<typeof events>;

export const eventsRelations = relations(events, ({ many }) => ({
	eventCategories: many(eventCategories),
	submissions: many(submissions),
	tickets: many(tickets)
}));

export default events;
