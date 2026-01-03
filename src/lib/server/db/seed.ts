import env from '$lib/env';
import { createBackendLogger } from '$lib/server/logger';
import { Table, getTableName, sql } from 'drizzle-orm';
import { db } from './index';
import * as schema from './schema';
import * as seeds from './seeds';

const logger = createBackendLogger('seed');

if (!env.DB_SEEDING) {
	throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
	return db.execute(sql.raw(`TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`));
}

logger.info('Resetting tables...');
for (const table of [
	schema.files,
	schema.users,
	schema.events,
	schema.categories,
	schema.eventCategories,
	schema.tickets,
	schema.entries,
	schema.media,
	schema.reactions,
	schema.rules,
	schema.prizes
]) {
	await resetTable(db, table);
}

logger.info('👤 Seeding users...');
await seeds.users(db);

logger.info('🔹 Seeding categories...');
await seeds.categories(db);

logger.info('🎟️ Seeding events...');
await seeds.events(db);

logger.info('🎫 Seeding entries...');
await seeds.entries(db);

logger.info('🎉 Seeding completed');
await db.$client.end();
