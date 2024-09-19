import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	const user = await db.select().from(users).where(eq(users.email, email));

	return new Response();
};
