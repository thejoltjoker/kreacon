import { hash } from '@node-rs/argon2';
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
					password: await hash(user.password, {
						memoryCost: 19456,
						timeCost: 2,
						outputLen: 32,
						parallelism: 1
					})
				})
				.returning();
		})
	);
};
export default seed;
