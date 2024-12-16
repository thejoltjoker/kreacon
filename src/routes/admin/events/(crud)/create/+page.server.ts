// import db from '$lib/server/db';
// import categories, { createCategorySchema } from '$lib/server/db/schema/category';
// import type { MediaType } from '$lib/types/mediaTypes';
// import { fail, redirect } from '@sveltejs/kit';
// import { eq } from 'drizzle-orm';
// import { StatusCodes } from 'http-status-codes';
// import kebabCase from 'lodash/kebabCase';
// import { zod } from 'sveltekit-superforms/adapters';
// import { superValidate } from 'sveltekit-superforms/server';
// import type { PageServerLoad } from './$types';

// export const load = (async () => {
// 	const form = await superValidate(zod(createCategorySchema));
// 	return { form };
// }) satisfies PageServerLoad;

// export const actions = {
// 	default: async ({ request }) => {
// 		const form = await superValidate(request, zod(createCategorySchema));

// 		if (!form.valid) {
// 			return fail(400, { form });
// 		}

// 		let slug = kebabCase(form.data.name);
// 		const existingCategory = await db.query.categories.findFirst({
// 			where: eq(categories.slug, slug)
// 		});

// 		if (existingCategory) {
// 			slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
// 		}

// 		await db.insert(categories).values({
// 			name: form.data.name,
// 			slug,
// 			description: form.data.description,
// 			mediaType: form.data.mediaType as MediaType
// 		});

// 		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/admin/categories');
// 	}
// };
import db from '$lib/server/db';
import events from '$lib/server/db/schema/event';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import kebabCase from 'lodash/kebabCase';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { eventCategories, rules } from '$lib/server/db/schema';
import { createEventSchema } from '$lib/schemas/eventSchema';

export const load = (async () => {
	const initialValues = {
		name: '',
		description: '',
		submissionsOpenAt: new Date(),
		submissionsCloseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		votingOpenAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		votingCloseAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
		categories: []
	};
	const form = await superValidate(initialValues, zod(createEventSchema));
	const categories = await db.query.categories.findMany({
		columns: {
			id: true,
			name: true
		},
		orderBy: (table, { asc }) => [asc(table.name)]
	});
	return { form, categories };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createEventSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let slug = kebabCase(form.data.name);
		const existingEvent = await db.query.events.findFirst({
			where: eq(events.slug, slug)
		});

		if (existingEvent) {
			slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
		}

		await db.transaction(async (trx) => {
			const [event] = await trx
				.insert(events)
				.values({ ...form.data, slug })
				.returning();

			const eventCategoriesData = form.data.categories
				.map((category) => ({
					eventId: event.id,
					categoryId: category.categoryId
				}))
				.filter((category) => category.categoryId > 0);
			const insertedEventCategories = await trx
				.insert(eventCategories)
				.values(eventCategoriesData)
				.returning();

			await trx.insert(rules).values([
				// General event rules
				...form.data.rules
					.filter((rule) => rule.text.length > 0)
					.map((rule) => ({
						text: rule.text,
						eventId: event.id
					})),
				// Category-specific rules
				...form.data.categories.flatMap((category) =>
					category.rules
						.filter((rule) => rule.text.length > 0)
						.map((rule) => ({
							text: rule.text,
							categoryId: insertedEventCategories.find((e) => e.categoryId === category.categoryId)
								?.id
						}))
				)
			]);

			return { event, insertedEventCategories };
		});

		redirect(StatusCodes.TEMPORARY_REDIRECT, `/admin/events`);
	}
};
