import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import * as schema from './schema';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL, { ssl: dev ? false : true });
export const db = drizzle(client, { schema });
