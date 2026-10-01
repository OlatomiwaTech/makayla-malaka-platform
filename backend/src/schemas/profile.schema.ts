import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(60, 'Display name must not exceed 60 characters')
    .optional(),

  bio: z
    .string()
    .trim()
    .max(160, 'Bio must not exceed 160 characters')
    .optional(),

  avatarUrl: z
    .string()
    .trim()
    .url('Avatar URL must be a valid URL')
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
