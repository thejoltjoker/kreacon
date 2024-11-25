import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { mediaTypeEnum, timestamps } from './shared';
import { submissions } from './submission';

export const media = pgTable('media', {
	id: serial().primaryKey(),
	submissionId: varchar('submission_id').references(() => submissions.id),
	type: mediaTypeEnum('type').notNull(),
	url: varchar({ length: 255 }).notNull(),
	filename: varchar({ length: 255 }).notNull(),
	alt: varchar({ length: 255 }),
	...timestamps
});

export const mediaRelations = relations(media, ({ one }) => ({
	submission: one(submissions, {
		fields: [media.submissionId],
		references: [submissions.id]
	})
}));

export type Media = InferSelectModel<typeof media>;
export type InsertMedia = InferInsertModel<typeof media>;

export default media;
