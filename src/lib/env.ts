import 'dotenv/config';
import { z } from 'zod';
import { LogLevelSchema } from './types/LogLevel';

const stringBoolean = z.coerce
	.string()
	.transform((val) => {
		return val === 'true';
	})
	.default('false');

const EnvSchema = z.object({
	BASE_URL: z.string().url(),
	DATABASE_URL: z.string(),
	OAUTH_DISCORD_CLIENT_SECRET: z.string(),
	OAUTH_DISCORD_REDIRECT_URI: z.string(),
	OAUTH_GITHUB_CLIENT_ID: z.string(),
	OAUTH_GITHUB_CLIENT_SECRET: z.string(),
	OAUTH_GITHUB_REDIRECT_URI: z.string(),
	TICKET_API_URL: z.string().url(),
	OAUTH_DISCORD_CLIENT_ID: z.string(),
	// Optional
	DB_MIGRATING: stringBoolean,
	DB_SEEDING: stringBoolean,
	AZURE_APP_INSIGHTS_CONNECTION_STRING: z.string().optional(),
	AZURE_STORAGE_ACCOUNT_NAME: z.string().optional(),
	DB_HOST: z.string().optional(),
	DB_NAME: z.string().optional(),
	DB_PASSWORD: z.string().optional(),
	DB_PORT: z.coerce.number().optional(),
	DB_USER: z.string().optional(),
	LOG_LEVEL: LogLevelSchema.optional(),
	NODE_ENV: z.string().default('development')
});

export type EnvSchema = z.infer<typeof EnvSchema>;

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
	console.error('Environment validation failed:');
	for (const issue of result.error.issues) {
		console.error(`- ${issue.path[0]}: ${issue.message}`);
	}
	process.exit(1);
} else {
	console.log('Environment is configured correctly');
}

export default EnvSchema.parse(process.env);
