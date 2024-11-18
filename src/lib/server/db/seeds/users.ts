import { db } from '../../db';
import * as schema from '../../db/schema';
import users from './data/users.json';
import bcrypt from 'bcryptjs';

export const seed = async (db: db) => {
	await Promise.all(
		users.map(async (user) => {
			await db
				.insert(schema.users)
				.values({
					...user,
					emailVerifiedAt: new Date(user.emailVerifiedAt),
					password: await bcrypt.hash(user.password, 12)
				})
				.returning();
		})
	);
};
export default seed;
