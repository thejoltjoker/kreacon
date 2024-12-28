import { pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { MediaTypes } from '../../../types/mediaTypes';
import { entryStatus } from '../../../types/entryStatus';
import { userRoles } from '../../../types/userRoles';
import { licenseCode } from '../../../schemas/license';

export const roleEnum = pgEnum('role', userRoles);
export const entryStatusEnum = pgEnum('entry_status', entryStatus);
export const licenseEnum = pgEnum('license', licenseCode);
export const timestamps = {
	createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};
export const mediaTypeEnum = pgEnum('media_type', MediaTypes);
