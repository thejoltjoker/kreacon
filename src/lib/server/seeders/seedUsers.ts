import { db } from '$lib/server/db';
import { users, type InsertUser } from '$lib/server/db/schema';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
	const values: InsertUser[] = [
		{
			id: '3dca8a6c-9604-4a7a-90c2-177c4b7d2a31',
			email: 'john.doe@example.com',
			username: 'john.doe',
			password: await bcrypt.hash('password', 10),
			emailVerifiedAt: new Date(),
			image: 'john.doe.webp',
			role: 'user'
		},
		{
			id: '726a0536-c092-4e47-807d-7b6118e821ea',
			email: 'jane.doe@example.com',
			username: 'jane.doe',
			password: await bcrypt.hash('password', 10),
			emailVerifiedAt: new Date(),
			image: 'jane.doe.webp',
			role: 'admin'
		},
		{
			id: 'eb86c861-9302-4712-a3b2-3bc0e74be482',
			email: 'alice.smith@example.com',
			username: 'alice.smith',
			password: await bcrypt.hash('password', 10),
			emailVerifiedAt: new Date(),
			image: 'alice.smith.webp',
			role: 'user'
		},
		{
			id: '3d115b8f-9be0-4937-b3d9-5576919568b4',
			email: 'bob.jones@example.com',
			username: 'bob.jones',
			password: await bcrypt.hash('password', 10),
			emailVerifiedAt: new Date(),
			image: 'bob.jones.webp',
			role: 'user'
		}
	];
	await db.insert(users).values(values).onConflictDoNothing();
};
