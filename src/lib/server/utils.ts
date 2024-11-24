import { hash, verify } from 'argon2';

export const argonSettings = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export const verifyPassword = async (password: string, hash: string) =>
	await verify(hash, password);

export const hashPassword = async (password: string) => await hash(password, argonSettings);
