import { z } from 'zod/v4';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];
export const LogLevelSchema = z.enum(LOG_LEVELS).default('info');
