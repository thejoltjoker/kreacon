import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import categories, {
	insertCategorySchema,
	updateCategorySchema
} from '$lib/server/db/schema/category';
import { zod } from 'sveltekit-superforms/adapters';
import db from '$lib/server/db';
import type { MediaType } from '$lib/types/mediaTypes';
import kebabCase from 'lodash/kebabCase';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { adminCheck } from '../../../utils';

export const load = (async ({ params, locals }) => {
	adminCheck(locals);
	const id = Number(params.id);
	const data = await db.query.categories.findFirst({
		where: eq(categories.id, id)
	});
	const form = await superValidate(data, zod(updateCategorySchema));
	return { form, data };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, params, locals }) => {
		adminCheck(locals);
		const id = Number(params.id);
		const form = await superValidate(request, zod(updateCategorySchema));

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
