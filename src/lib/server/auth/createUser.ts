import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import ServerError from '$lib/ServerError';
import bcrypt from 'bcryptjs';
import ServerError from '$lib/server/ServerError';

export const createUser = async (email: string, password: string) => {
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const result = await db.insert(users).values({ email, password: hashedPassword }).returning();
		return result[0];
	} catch (error) {
		console.error('Error creating user:', error);
		throw new ServerError(500, 'Failed to create user');
	}
};
