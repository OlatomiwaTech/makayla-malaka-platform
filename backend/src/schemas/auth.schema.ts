import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

export const registerSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long.')
    .max(30, 'Username must be at most 30 characters long.')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, underscores, dots, and dashes.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.').max(128),
  displayName: z.preprocess(emptyStringToUndefined, z.string().min(2, 'Display name must be at least 2 characters long.').max(50, 'Display name must be at most 50 characters long.').optional()),
  bio: z.preprocess(emptyStringToUndefined, z.string().max(250, 'Bio must be at most 250 characters long.').optional()),
});

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.').max(128),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
