// Ids to use:
// StrongCuriousDachshund
//
//
// StrongCuriousChimpanzee
// StrongCuriousLoach
// StrongCuriousKakapo
// StrongCuriousBee
// StrongCuriousFlamingo
// StrongCuriousCoelacanth
// StrongCuriousSiberian
// StrongCuriousMoth
// StrongCuriousZebu
// StrongCuriousDodo
// StrongCuriousCoral
// StrongCuriousStingray
// StrongCuriousBichir
// StrongCuriousNightingale
// StrongCuriousEchidna
// StrongCuriousMayfly
// StrongCuriousTetra
// StrongCuriousParrot
// StrongCuriousMarmot
// StrongCuriousAbyssinian
// StrongCuriousChameleon
// StrongCuriousIguana
// StrongCuriousChamois
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import * as schema from '../../db/schema';
import data from './data/submissions.json';
import type { MediaType } from '$lib/types/mediaTypes';
import type { SubmissionStatus } from '$lib/types/submissionStatus';
import type { LicenseCode } from '$lib/schemas/license';

async function getUserIdFromEmail(db: db, email: string) {
	const user = await db.query.users.findFirst({
		where: eq(schema.users.email, email)
	});
	if (!user) {
		throw new Error('Unknown user: ' + email);
	}
	return user.id;
}

async function getEventId(db: db, eventName: string) {
	const event = await db.query.events.findFirst({
		where: eq(schema.events.name, eventName)
	});
	if (!event) {
		throw new Error('Unknown event: ' + eventName);
	}
	return event.id;
}

async function getTicketId(db: db, eventId: number, userId: string) {
	const ticket = await db.query.tickets.findFirst({
		where: and(eq(schema.tickets.eventId, eventId), eq(schema.tickets.userId, userId))
	});
	if (!ticket) {
		throw new Error('Unknown ticket: ' + userId + ' for event ' + eventId);
	}
	return ticket.id;
}

async function getCategoryId(db: db, eventId: number, categoryName: string) {
	const [category] = await db
		.select()
		.from(schema.eventCategories)
		.innerJoin(schema.categories, eq(schema.categories.id, schema.eventCategories.categoryId))
		.where(
			and(eq(schema.eventCategories.eventId, eventId), eq(schema.categories.name, categoryName))
		)
		.limit(1);

	if (!category) {
		throw new Error('Unknown category: ' + categoryName);
	}
	return category.category.id;
}

export const seed = async (db: db) => {
	await Promise.all(
		data.map(async (submission) => {
			const userId = await getUserIdFromEmail(db, submission.user.email);
			const eventId = await getEventId(db, submission.event.name);
			const categoryId = await getCategoryId(db, eventId, submission.category.name);
			const ticketId = await getTicketId(db, eventId, userId);

			let userEmails: string[] = [];
			if (submission.reactions) {
				userEmails = submission.reactions.map((reaction) => reaction.user.email);
			}
			const userIds = await Promise.all(userEmails.map((email) => getUserIdFromEmail(db, email)));

			const emailToUserId = Object.fromEntries(
				userEmails.map((email, index) => [email, userIds[index]])
			);

			await db.transaction(async (tx) => {
				let insertedThumbnail: string | null = null;

				if (submission.thumbnail) {
					const [result] = await tx
						.insert(schema.files)
						.values({
							...submission.thumbnail,
							type: submission.thumbnail.type as MediaType,
							name: submission.thumbnail.url,
							size: 0
						})
						.returning();
					insertedThumbnail = result.id;
				}

				const [insertedMedia] = await tx
					.insert(schema.files)
					.values({
						...submission.media,
						type: submission.media.type as MediaType,
						name: submission.media.url,
						size: 0
					})
					.returning();

				const [insertedSubmission] = await tx
					.insert(schema.submissions)
					.values({
						...submission,
						status: submission.status as SubmissionStatus,
						eventId: eventId,
						categoryId: categoryId,
						userId: userId,
						ticketId: ticketId,
						mediaId: insertedMedia.id,
						thumbnailId: insertedThumbnail ?? insertedMedia.id,
						createdAt: submission.createdAt ? new Date(submission.createdAt) : new Date(),
						license: submission.license as LicenseCode
					})
					.returning();

				if (submission.reactions) {
					await Promise.all(
						submission.reactions.map(async (reaction) => {
							await tx
								.insert(schema.reactions)
								.values({
									...reaction,
									userId: emailToUserId[reaction.user.email],
									submissionId: insertedSubmission.id
								})
								.returning();
						})
					);
				}
			});
		})
	);
};
export default seed;
