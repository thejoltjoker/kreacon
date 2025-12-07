import db from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import kebabCase from 'lodash/kebabCase';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { createEventSchema, type CreateEventSchema } from '$lib/schemas/eventSchema';
import { eventCategories, events, rules } from '$lib/server/db/schema';
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

	const form = await superValidate(formData, zod4(createEventSchema), { id: 'edit-event-form' });
	return { form, categories };
}) satisfies PageServerLoad;

const generateUniqueSlug = async (
	baseName: string,
	eventId: number,
	maxAttempts = 5
): Promise<string> => {
	const slug = kebabCase(baseName);
	let attempt = 0;

	while (attempt < maxAttempts) {
		const suffix = attempt > 0 ? `-${Math.floor(Math.random() * 10000)}` : '';
		const candidateSlug = `${slug}${suffix}`;

		const existingEvent = await db.query.events.findFirst({
			where: eq(events.slug, candidateSlug)
		});

		if (!existingEvent || existingEvent.id === eventId) {
			return candidateSlug;
		}

		attempt++;
	}

	return `${slug}-${Date.now()}`;
};

export const actions = {
	default: async ({ request, params }) => {
		const eventId = Number(params.id);
		const form = await superValidate(request, zod4(createEventSchema), {
			id: 'edit-event-form'
		});

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, { form });
		}

		const slug = await generateUniqueSlug(form.data.name, eventId);

		await db.transaction(async (trx) => {
			// Update the event
			await trx
				.update(events)
				.set({ ...form.data, slug })
				.where(eq(events.id, eventId));

			// Delete existing relationships and rules
			await trx.delete(rules).where(eq(rules.eventId, eventId));
			await trx.delete(eventCategories).where(eq(eventCategories.eventId, eventId));

			// Insert new categories
			const eventCategoriesData = form.data.categories
				.map((category) => ({
					eventId,
					categoryId: category.categoryId
				}))
				.filter((category) => category.categoryId > 0);

			const insertedEventCategories =
				eventCategoriesData.length > 0
					? await trx.insert(eventCategories).values(eventCategoriesData).returning()
					: [];

			// Insert new rules
			const allRules = [
				// General event rules
				...(form.data.rules ?? [])
					.filter((rule) => rule.text.length > 0)
					.map((rule) => ({
						text: rule.text,
						eventId
					})),
				// Category-specific rules
				...(form.data.categories ?? []).flatMap((category) =>
					(category.rules ?? [])
						.filter((rule) => rule.text.length > 0)
						.map((rule) => ({
							text: rule.text,
							categoryId: insertedEventCategories.find((e) => e.categoryId === category.categoryId)
								?.id
						}))
				)
			];

			if (allRules.length > 0) {
				await trx.insert(rules).values(allRules);
			}
		});

		redirect(StatusCodes.TEMPORARY_REDIRECT, `/admin/events`);
	}
} satisfies Actions;
