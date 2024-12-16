import db from '$lib/server/db';
import categories, { createCategorySchema } from '$lib/server/db/schema/category';
import type { MediaType } from '$lib/types/mediaTypes';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import kebabCase from 'lodash/kebabCase';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { createEventSchema, type CreateEventSchema } from '$lib/schemas/eventSchema';
import { events } from '$lib/server/db/schema';
import { adminCheck } from '../../../../utils';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	adminCheck(locals);
	const id = Number(params.id);
	const data = await db.query.events.findFirst({
		where: eq(events.id, id),
		with: {
			rules: true,
			eventCategories: { with: { category: true, rules: true } }
		}
	});
	const categories = await db.query.categories.findMany({
		columns: {
			id: true,
			name: true
		},
		orderBy: (table, { asc }) => [asc(table.name)]
	});
	if (data == null) {
		return error(StatusCodes.NOT_FOUND, { message: 'Event not found' });
	}
	const formData: CreateEventSchema = {
		...data,
		rules: data.rules.map((rule) => ({
			text: rule.text,
			isLocked: true
		})),
		categories: data.eventCategories.map((category) => ({
			categoryId: category.categoryId,
			rules: category.rules.map((rule) => ({
				text: rule.text,
				isLocked: true
			}))
		}))
	};
	console.log(formData);
	const form = await superValidate(formData, zod(createEventSchema));
	return { form, categories };
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
