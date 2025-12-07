import db from '$lib/server/db';

import type { MediaType } from '$lib/types/mediaTypes';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import kebabCase from 'lodash/kebabCase';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { createCategorySchema } from '$lib/schemas/categorySchema';
import { categories } from '$lib/server/db/schema';
import { adminCheck } from '../../../utils';

export const load = (async ({ locals }) => {
	adminCheck(locals);
	const form = await superValidate(zod4(createCategorySchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(createCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let slug = kebabCase(form.data.name);
		const existingCategory = await db.query.categories.findFirst({
			where: eq(categories.slug, slug)
		});

		if (existingCategory) {
			slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
		}

		await db.insert(categories).values({
			name: form.data.name,
			slug,
			description: form.data.description,
			mediaType: form.data.mediaType as MediaType
		});

		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/admin/categories');
	}
};
