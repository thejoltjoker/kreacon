import { pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { userRoles } from '$lib/types/userRoles';
export const roleEnum = pgEnum('role', userRoles);
export const timestamps = {
	createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'audio']);
