import { userUpdateSchema } from '$lib/schemas/userRegistrationSchema';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
	const user = await db.query.users.findFirst({ where: eq(users.id, locals.user.id) });

	if (!user) {
		return redirect(302, '/login');
	}
	const form = await superValidate(user, zod(userUpdateSchema));

	return { form, user: locals.user };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(userUpdateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// Check if user with email or username exists
		if (await db.query.users.findFirst({ where: eq(users.username, form.data.username ?? '') })) {
			return setError(form, 'username', 'Username unavailable.');
		}

		if (await db.query.users.findFirst({ where: eq(users.email, form.data.email ?? '') })) {
			return setError(form, 'email', 'Email unavailable.');
		}

		await db
			.insert(users)
			.values({ id: form.data.id })
			.onConflictDoUpdate({
				target: users.id,
				set: form.data
			})
			.returning();

		return message(form, 'Form posted successfully!');
	}
};
