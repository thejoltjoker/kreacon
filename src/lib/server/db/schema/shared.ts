import { pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const timestamps = {
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' })
		.defaultNow()
		.$onUpdate(() => new Date().toISOString())
};
export const mediaTypeEnum = pgEnum('mediaType', ['image', 'video', 'audio']);
