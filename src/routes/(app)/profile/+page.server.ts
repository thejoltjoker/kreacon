import { userUpdateSchema } from '$lib/schemas/userRegistrationSchema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';

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

		const result = await db
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
