import { hashPassword } from '$lib/server/utils';
import type { UserRole } from '../../../types/userRoles';
import { db } from '../../db';
import * as schema from '../../db/schema';
import users from './data/users.json';

export const seed = async (db: db) => {
	await Promise.all(
		users.map(async (user) => {
			await db
				.insert(schema.users)
				.values({
					...user,
					emailVerifiedAt: new Date(user.emailVerifiedAt),
					role: user.role as UserRole,
					password: await hashPassword(user.password)
				})
				.returning();
		})
	);
};
export default seed;
