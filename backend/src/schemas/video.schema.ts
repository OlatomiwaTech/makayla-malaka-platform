import { z } from 'zod';

import { extractYouTubeVideoId } from '../lib/youtube.js';

const youtubeUrlSchema = z
  .string()
  .trim()
  .url('Enter a valid YouTube URL')
  .refine(
    (value) => extractYouTubeVideoId(value) !== null,
    'Enter a valid YouTube URL',
  );

export const createVideoSchema = z.object({
  youtubeUrl: youtubeUrlSchema,

  title: z
    .string()
    .trim()
    .min(1)
    .max(150),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  seoTitle: z.string().trim().max(70).optional(),

  seoDescription: z.string().trim().max(320).optional(),

  thumbnailUrl: z
    .string()
    .trim()
    .url()
    .optional(),

  category: z
    .string()
    .trim()
    .min(1)
    .max(50),

  status: z
    .enum([
      'DRAFT',
      'PUBLISHED',
      'ARCHIVED',
    ])
    .default('DRAFT'),
});

export const updateVideoSchema = z.object({
  youtubeUrl: youtubeUrlSchema.optional(),

  title: z
    .string()
    .trim()
    .min(1)
    .max(150)
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  seoTitle: z.string().trim().max(70).optional(),

  seoDescription: z.string().trim().max(320).optional(),

  category: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .optional(),

  thumbnailUrl: z
    .string()
    .trim()
    .url()
    .optional(),

  status: z
    .enum([
      'DRAFT',
      'PUBLISHED',
      'ARCHIVED',
    ])
    .optional(),
});

export const videoListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(12),

  category: z
    .string()
    .trim()
    .optional(),
});

export const managedVideoListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().max(150).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  category: z.string().trim().max(50).optional(),
});

export const videoPreviewQuerySchema = z.object({
  url: youtubeUrlSchema,
});

export type CreateVideoInput =
  z.infer<typeof createVideoSchema>;

export type ManagedVideoListQuery =
  z.infer<typeof managedVideoListQuerySchema>;

export type UpdateVideoInput =
  z.infer<typeof updateVideoSchema>;
