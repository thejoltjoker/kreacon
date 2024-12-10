import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import categories, { insertCategorySchema } from '$lib/server/db/schema/category';
import { zod } from 'sveltekit-superforms/adapters';
import db from '$lib/server/db';
import type { MediaType } from '$lib/types/mediaTypes';
import kebabCase from 'lodash/kebabCase';
import { eq } from 'drizzle-orm';

const schema = insertCategorySchema.pick({ mediaType: true, description: true, name: true });

export const load = (async () => {
	const form = await superValidate(zod(schema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log(form.data);
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

		// TODO: Add your category creation logic here
		return message(form, { status: 'success', message: 'Category created successfully' });
	}
};
