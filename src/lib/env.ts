import 'dotenv/config';
import { ZodError, z } from 'zod';
import { LogLevelSchema } from './types/LogLevel';

const stringBoolean = z.coerce
	.string()
	.transform((val) => {
		return val === 'true';
	})
	.default('false');

const EnvSchema = z.object({
	NODE_ENV: z.string().default('development'),
	BASE_URL: z.string().url(),
	DB_HOST: z.string().optional(),
	DB_USER: z.string().optional(),
	DB_PASSWORD: z.string().optional(),
	DB_NAME: z.string().optional(),
	DB_PORT: z.coerce.number().optional(),
	DATABASE_URL: z.string(),
	DB_MIGRATING: stringBoolean,
	DB_SEEDING: stringBoolean,
	AZURE_APP_INSIGHTS_CONNECTION_STRING: z.string().optional(),
	LOG_LEVEL: LogLevelSchema.optional(),
	AZURE_STORAGE_ACCOUNT_NAME: z.string().optional(),
	OAUTH_DISCORD_CLIENT_ID: z.string(),
	OAUTH_DISCORD_CLIENT_SECRET: z.string(),
	OAUTH_DISCORD_REDIRECT_URI: z.string(),
	OAUTH_GITHUB_CLIENT_ID: z.string(),
	OAUTH_GITHUB_CLIENT_SECRET: z.string(),
	OAUTH_GITHUB_REDIRECT_URI: z.string(),
	TICKET_API_URL: z.string().url()
});

export type EnvSchema = z.infer<typeof EnvSchema>;

try {
	const parsed = EnvSchema.parse(process.env);
	console.log('Environment is configured correctly');
} catch (error) {
	if (error instanceof ZodError) {
		let message = 'Missing required values in .env:\n';
		error.issues.forEach((issue) => {
			message += issue.path[0] + '\n';
		});
		const e = new Error(message);
		e.stack = '';
		throw e;
	} else {
		console.error(error);
	}
}

export default EnvSchema.parse(process.env);
