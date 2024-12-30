import { hashPassword } from '$lib/server/utils';
import type { UserRole } from '../../../types/userRoles';
import { db } from '../../db';
import * as schema from '../../db/schema';
import users from './data/users.json';

export const seed = async (db: db) => {
	await Promise.all(
		users.map(async (user) => {
			const avatarId = crypto.randomUUID();
			const [avatar] = await db
				.insert(schema.files)
				.values({
					id: avatarId,
					url: user.picture,
					type: 'image/webp',
					name: avatarId + user.picture,
					size: 0
				})
				.returning();
			await db
				.insert(schema.users)
				.values({
					...user,
					avatarId: avatar.id,
					emailVerifiedAt: new Date(user.emailVerifiedAt),
					role: user.role as UserRole,
					password: await hashPassword(user.password)
				})
				.returning();
		})
	);
};
export default seed;
