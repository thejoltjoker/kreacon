import db from '$lib/server/db';
import type { MediaType } from '$lib/types/mediaTypes';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import kebabCase from 'lodash/kebabCase';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { adminCheck } from '../../../../utils';
import { createCategorySchema } from '$lib/schemas/categorySchema';
import { categories } from '$lib/server/db/schema';

export const load = (async ({ params, locals }) => {
	adminCheck(locals);
	const id = Number(params.id);
	const data = await db.query.categories.findFirst({
		where: eq(categories.id, id)
	});
	const form = await superValidate(data, zod(createCategorySchema));
	return { form, data };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, params, locals }) => {
		adminCheck(locals);
		const id = Number(params.id);
		const form = await superValidate(request, zod(createCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let { slug } = form.data;

		if (slug == null) {
			slug = kebabCase(form.data.name);
		}

		const existingCategory = await db.query.categories.findFirst({
			where: eq(categories.slug, slug)
		});

		if (existingCategory) {
			slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
		}

		await db
			.update(categories)
			.set({
				name: form.data.name,
				slug,
				description: form.data.description,
				mediaType: form.data.mediaType as MediaType
			})
			.where(eq(categories.id, id));

		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/admin/categories');
	}
} satisfies Actions;
