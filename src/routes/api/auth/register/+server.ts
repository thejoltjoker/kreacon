import { register } from '$lib/auth';
import { json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	const user = await register(email, password);

	return json(
		{ message: 'User created successfully', email: user.email },
		{
			status: StatusCodes.CREATED
		}
	);
};
