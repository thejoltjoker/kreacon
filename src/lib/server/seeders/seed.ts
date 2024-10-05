import { createLogger } from '$lib/server/logger';
import { seedCategories } from './seedCategories';
import { seedEvents } from './seedEvents';
import { seedMedia } from './seedMedia';
import { seedReactions } from './seedReactions';
import { seedSubmissions } from './seedSubmissions';
import { seedUsers } from './seedUsers';
import { seedVotes } from './seedVotes';

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
	logger.info('Seeding media...');
	await seedMedia();
	logger.info('Seeding reactions...');
	await seedReactions();
	logger.info('Seeding votes...');
	await seedVotes();
	logger.info('Seeding completed');
};

// seed();
