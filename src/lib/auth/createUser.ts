import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import ServerError from '$lib/ServerError';
import * as bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

export const createUser = async (email: string, password: string) => {
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const result = await db.insert(users).values({ email, password: hashedPassword }).returning();
		return result[0];
	} catch (error) {
		console.error('Error creating user:', error);
		throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create user');
	}
};
