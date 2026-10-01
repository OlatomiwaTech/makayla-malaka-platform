import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .max(150, 'Title must not exceed 150 characters')
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(5000, 'Content must not exceed 5000 characters'),

  imageUrl: z
    .string()
    .trim()
    .url('Image URL must be a valid URL')
    .optional(),

  status: z
    .enum(['DRAFT', 'PUBLISHED'])
    .default('DRAFT'),
});

export const updatePostSchema =
  createPostSchema.partial();

export const postListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});

export type CreatePostInput =
  z.infer<typeof createPostSchema>;

export type UpdatePostInput =
  z.infer<typeof updatePostSchema>;