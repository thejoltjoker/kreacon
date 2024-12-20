import { pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { MediaTypes } from '../../../types/mediaTypes';
import { submissionStatus } from '../../../types/submissionStatus';
import { userRoles } from '../../../types/userRoles';

export const roleEnum = pgEnum('role', userRoles);
export const submissionStatusEnum = pgEnum('submission_status', submissionStatus);
export const timestamps = {
	createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};
export const mediaTypeEnum = pgEnum('media_type', MediaTypes);
