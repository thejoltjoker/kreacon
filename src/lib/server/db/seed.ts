import env from '$lib/env';
import { createLogger } from '$lib/server/logger';
import { Table, getTableName, sql } from 'drizzle-orm';
import { db } from './index';
import * as schema from './schema';
import * as seeds from './seeds';

const logger = createLogger('seed');

if (!env.DB_SEEDING) {
	throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
	return db.execute(sql.raw(`TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`));
}

logger.info('Resetting tables...');
for (const table of [
	schema.users,
	schema.events,
	schema.categories,
	schema.categoriesToEvents,
	schema.tickets,
	schema.submissions,
	schema.media,
	schema.reactions
]) {
	await resetTable(db, table);
}

logger.info('Seeding users...');
await seeds.users(db);

logger.info('Seeding categories...');
await seeds.categories(db);

logger.info('Seeding events...');
await seeds.events(db);

logger.info('Seeding submissions...');
await seeds.submissions(db);

logger.info('Seeding completed');
await db.$client.end();

