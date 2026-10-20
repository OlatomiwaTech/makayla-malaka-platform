import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().positive().default(5000),

  FRONTEND_URL: z
    .string()
    .url()
    .optional(),

  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required'),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters'),

  ADMIN_SETUP_KEY: z
    .string()
    .min(32, 'ADMIN_SETUP_KEY must be at least 32 characters')
    .optional(),

  YOUTUBE_API_KEY: z.string().trim().min(1).optional(),

  YOUTUBE_CHANNEL_ID: z
    .string()
    .trim()
    .regex(/^UC[A-Za-z0-9_-]{22}$/, 'YOUTUBE_CHANNEL_ID must be a YouTube channel ID')
    .optional(),

  YOUTUBE_CHANNEL_HANDLE: z
    .string()
    .trim()
    .default('@MakaylaSuperstar'),

  RESEND_API_KEY: z.string().trim().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().trim().min(1).optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:');
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

if (parsedEnv.data.NODE_ENV === 'production') {
  if (!parsedEnv.data.FRONTEND_URL) {
    console.error('Invalid environment configuration: FRONTEND_URL is required in production.');
    process.exit(1);
  }

  const frontendUrl = new URL(parsedEnv.data.FRONTEND_URL);
  if (
    frontendUrl.protocol !== 'https:' ||
    frontendUrl.username ||
    frontendUrl.password ||
    frontendUrl.pathname !== '/' ||
    frontendUrl.search ||
    frontendUrl.hash
  ) {
    console.error('Invalid environment configuration: FRONTEND_URL must be an HTTPS origin.');
    process.exit(1);
  }
}

export const env = {
  ...parsedEnv.data,
  FRONTEND_URL: parsedEnv.data.FRONTEND_URL ?? 'http://localhost:3000',
};
