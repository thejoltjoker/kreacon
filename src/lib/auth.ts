import { eq } from 'drizzle-orm';
import { db } from './server/db';
import { users } from './server/db/schema';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import ServerError from './ServerError';

export const register = async (email: string, password: string) => {
	const user = await db.select().from(users).where(eq(users.email, email));

	if (user) {
		throw new ServerError('User already exists', StatusCodes.BAD_REQUEST);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.insert(users).values({
		email,
		password: hashedPassword
	});
	return { email };
};

export const login = async (email: string, password: string) => {
	const result = await db.select().from(users).where(eq(users.email, email));

	if (!result) {
		throw new ServerError('User not found', StatusCodes.NOT_FOUND);
	}

	if (!result[0].password) {
		throw new ServerError('Password not set', StatusCodes.INTERNAL_SERVER_ERROR);
	}

	const passwordMatch = await bcrypt.compare(password, result[0].password);

	if (!passwordMatch) {
		throw new ServerError('Invalid password', StatusCodes.UNAUTHORIZED);
	}

	return result;
};
