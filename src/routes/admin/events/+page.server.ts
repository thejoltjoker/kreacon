import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const events = await db.query.events.findMany();

	return { events, title: { text: 'Events', href: '/admin/events' } };
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		console.log(id);
		await db.delete(events).where(eq(events.id, Number(id)));
	}
} satisfies Actions;
