import { login } from '$lib/auth';
import { json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	const user = await login(email, password);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...userWithoutPassword } = user;

	return json(
		{ message: 'Login successful', user: userWithoutPassword },
		{ status: StatusCodes.OK }
	);
};
