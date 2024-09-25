import { db } from '../db';
import { users } from '../db/schema';
import ServerError from '../ServerError';
import bcrypt from 'bcryptjs';

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
