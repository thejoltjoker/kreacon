import { db } from '$lib/server/db';
import users, { updateUserSchema } from '$lib/server/db/schema/user';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user || !locals.session) {
		return redirect(302, '/login');
	}
	const user = await db.query.users.findFirst({
		where: eq(users.id, locals.user.id),
		columns: {
			password: false
		}
	});

	if (!user) {
		return redirect(302, '/login');
	}
	const form = await superValidate(user, zod(updateUserSchema));

	return { form, user };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return redirect(302, '/login');
		}

		const form = await superValidate(request, zod(updateUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (await db.query.users.findFirst({ where: eq(users.username, form.data.username ?? '') })) {
			return setError(form, 'username', 'Username unavailable.');
		}

		if (await db.query.users.findFirst({ where: eq(users.email, form.data.email ?? '') })) {
			return setError(form, 'email', 'Email unavailable.');
		}

		await db.update(users).set(form.data).where(eq(users.id, locals.user.id));

		return message(form, 'Form posted successfully!');
	}
};
