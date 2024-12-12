import { defineConfig } from 'drizzle-kit';
import env from './src/lib/env';

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './src/lib/server/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
		ssl: env.NODE_ENV === 'production' ? 'require' : false
	},
	verbose: true,
	strict: true
});
