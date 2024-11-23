import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import events from './event';
import { timestamps } from './shared';
import users from './user';

export const tickets = pgTable('tickets', {
	id: varchar({ length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: uuid('user_id'),
	eventId: integer('event_id'),
	...timestamps
});

export type Ticket = InferSelectModel<typeof tickets>;
export type InsertTicket = InferInsertModel<typeof tickets>;

export const ticketsRelations = relations(tickets, ({ one }) => ({
	user: one(users, {
		fields: [tickets.userId],
		references: [users.id]
	}),
	event: one(events, {
		fields: [tickets.eventId],
		references: [events.id]
	})
}));

export default tickets;
