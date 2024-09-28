import { createLogger } from '$lib/server/logger';
import { seedCategories } from './seedCategories';
import { seedEvents } from './seedEvents';
import { seedSubmissions } from './seedSubmissions';
import { seedUsers } from './seedUsers';

const logger = createLogger('seed');

export const seed = async () => {
	logger.info('Seeding...');
	logger.info('Seeding users...');
	await seedUsers();
	logger.info('Seeding events...');
	await seedEvents();
	logger.info('Seeding categories...');
	await seedCategories();
	logger.info('Seeding submissions...');
	await seedSubmissions();
	logger.info('Seeding completed');
};

// seed();
