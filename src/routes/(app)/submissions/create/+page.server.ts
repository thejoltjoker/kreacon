import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// const form = await superValidate(zod(createSubmissionSchema));

	// const { user } = locals;
	// // const result = await db.query.users.findFirst({
	// // 	where: eq(users.id, user.id),
	// // 	with: {
	// // 		tickets: true
	// // 	}
	// // });

	// // TODO Show register ticket link if no tickets

	// try {
	// 	// Get user based on cookie
	// 	const result = await db.query.users.findFirst({
	// 		where: eq(users.id, user.id),
	// 		with: {
	// 			tickets: {
	// 				with: {
	// 					event: {
	// 						where: (event, { and, gte, lte }) =>
	// 							and(
	// 								lte(event.submissionsOpenAt, new Date()), // event.submissionsOpenAt >= new Date()
	// 								gte(event.submissionsCloseAt, new Date()) // event.submissionsCloseAt <= new Date()
	// 							),
	// 						with: {
	// 							submissions: {
	// 								where: eq(submissions.userId, user.id)
	// 							},
	// 							categoriesToEvents: {
	// 								with: {
	// 									category: true
	// 								}
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	});
	// 	const categoriesOptions: SelectOptions = [];
	// 	const events = result?.tickets.map((ticket) => ticket.event);
	// 	for (const event of events) {
	// 		const submissions = event.submissions;
	// 		const submittedCategoryIds = submissions?.map((submission) => submission.categoryId);
	// 		const categories = event.categoriesToEvents.map((cte) => ({
	// 			value: cte.category.id,
	// 			label: cte.category.name,
	// 			isDisabled: submittedCategoryIds?.includes(cte.category.id)
	// 		}));
	// 		categoriesOptions.push({
	// 			groupLabel: event.name,
	// 			options: categories
	// 		});
	// 	}

	// 	if (!result) {
	// 		throw redirect(302, '/login');
	// 	}

	// 	return { form, categoriesOptions };
	// } catch (error) {
	// 	console.error(error);
	// 	return { form, categoriesOptions: [] };
	// }
}) satisfies PageServerLoad;

export const actions = {
	default: async () => {
		// const form = await superValidate(request, zod(createSubmissionSchema));
		// if (!form.valid) {
		// 	// Again, return { form } and things will just work.
		// 	return fail(400, { form });
		// }
		// // TODO: Do something with the validated form.data
		// // Display a success status message
		// return message(form, 'Form posted successfully!');
	}
};
