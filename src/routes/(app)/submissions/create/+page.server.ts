import { createSubmissionSchema } from '$lib/schemas/createSubmissionSchema';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { submissions, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/pg-core/expressions';
import type { SelectOptions } from '$lib/types/SelectOptions';

export const load = (async ({ cookies, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { userId } = locals.user;

	// Get user based on cookie
	const user = await db.query.users.findFirst({
		where: eq(users.id, locals.user.userId),
		with: {
			tickets: {
				with: {
					event: {
						with: {
							submissions: {
								where: (submissions, { eq }) => eq(submissions.userId, userId)
							},
							categoriesToEvents: {
								with: {
									category: true
								}
							}
						}
					}
				}
			}
		}
	});
	const categoriesOptions: SelectOptions = [];
	const events = user?.tickets.map((ticket) => ticket.event);
	for (const event of events) {
		const submissions = event.submissions;
		const submittedCategoryIds = submissions?.map((submission) => submission.categoryId);
		const categories = event.categoriesToEvents.map((cte) => ({
			value: cte.category.id,
			label: cte.category.name,
			isDisabled: submittedCategoryIds?.includes(cte.category.id)
		}));
		categoriesOptions.push({
			groupLabel: event.name,
			options: categories
		});
	}

	// console.log(categoriesOptions);

	if (!user) {
		throw redirect(302, '/login');
	}

	const form = await superValidate(zod(createSubmissionSchema));
	return { form, categoriesOptions };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createSubmissionSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
