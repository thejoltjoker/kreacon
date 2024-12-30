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
import { db } from '..';
import * as schema from '../schema';
import data from './data/entries.json';
import type { MediaType } from '$lib/types/mediaTypes';
import type { EntryStatus } from '$lib/types/entryStatus';
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
		data.map(async (entry) => {
			const userId = await getUserIdFromEmail(db, entry.user.email);
			const eventId = await getEventId(db, entry.event.name);
			const categoryId = await getCategoryId(db, eventId, entry.category.name);
			const ticketId = await getTicketId(db, eventId, userId);

			let userEmails: string[] = [];
			if (entry.reactions) {
				userEmails = entry.reactions.map((reaction) => reaction.user.email);
			}
			const userIds = await Promise.all(userEmails.map((email) => getUserIdFromEmail(db, email)));

			const emailToUserId = Object.fromEntries(
				userEmails.map((email, index) => [email, userIds[index]])
			);

			await db.transaction(async (tx) => {
				let insertedThumbnail: string | null = null;

				if (entry.thumbnail) {
					const [result] = await tx
						.insert(schema.files)
						.values({
							...entry.thumbnail,
							type: entry.thumbnail.type as MediaType,
							name: entry.thumbnail.url,
							size: 0
						})
						.returning();
					insertedThumbnail = result.id;
				}

				const [insertedMedia] = await tx
					.insert(schema.files)
					.values({
						...entry.media,
						type: entry.media.type as MediaType,
						name: entry.media.url,
						// TODO Set file size
						size: 0
					})
					.returning();

				const [insertedEntry] = await tx
					.insert(schema.entries)
					.values({
						...entry,
						status: entry.status as EntryStatus,
						eventId: eventId,
						categoryId: categoryId,
						userId: userId,
						ticketId: ticketId,
						mediaId: insertedMedia.id,
						thumbnailId: insertedThumbnail ?? insertedMedia.id,
						previewId: insertedThumbnail ?? insertedMedia.id,
						createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
						license: entry.license as LicenseCode
					})
					.returning();

				if (entry.reactions) {
					await Promise.all(
						entry.reactions.map(async (reaction) => {
							await tx
								.insert(schema.reactions)
								.values({
									...reaction,
									userId: emailToUserId[reaction.user.email],
									entryId: insertedEntry.id
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
