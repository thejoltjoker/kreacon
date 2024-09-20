// import { describe, it, expect, afterEach, vi } from 'vitest';
// import { register } from './auth';
// import { db } from './server/db';
// import { users } from './server/db/schema';
// import bcrypt from 'bcrypt';
// import ServerError from './ServerError';

// // Mock db and bcrypt
// vi.mock('./server/db', () => ({
// 	db: {
// 		select: vi.fn(),
// 		insert: vi.fn()
// 	}
// }));

// describe('register', () => {
// 	afterEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	it('should register a new user successfully', async () => {
// 		const email = 'test@example.com';
// 		const password = 'password123';
// 		const hashedPassword = bcrypt.hash(password, 10);

// 		vi.mocked(db.select).mockReturnValue({
// 			from: vi.fn().mockReturnValue({
// 				where: vi.fn().mockResolvedValue(null)
// 			})
// 		} as any);

// 		vi.mocked(db.insert).mockReturnValue({
// 			values: vi.fn().mockResolvedValue(undefined)
// 		} as any);

// 		const result = await register(email, password);

// 		expect(result).toEqual({ email });
// 		expect(db.select).toHaveBeenCalled();
// 		expect(bcrypt.hash(password, 10)).toEqual(password);
// 		expect(db.insert).toHaveBeenCalledWith(users);
// 		expect(vi.mocked(db.insert(users).values)).toHaveBeenCalledWith({
// 			email,
// 			hashedPassword
// 		});
// 	});

// 	it('should throw an error if user already exists', async () => {
// 		const email = 'existing@example.com';
// 		const password = 'password123';

// 		vi.mocked(db.select).mockReturnValue({
// 			from: vi.fn().mockReturnValue({
// 				where: vi.fn().mockResolvedValue({ id: 1, email })
// 			})
// 		} as any);

// 		await expect(register(email, password)).rejects.toThrow(ServerError);
// 		await expect(register(email, password)).rejects.toThrow('User already exists');
// 	});
// });
