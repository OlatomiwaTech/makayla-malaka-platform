import { z } from 'zod';
export const createPostSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(120, 'Title must be 120 characters or fewer').optional(),
    content: z.string().trim().min(1, 'Content is required').max(5000, 'Content must be 5000 characters or fewer'),
    imageUrl: z.string().url('Image URL must be a valid URL').optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});
export const updatePostSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(120, 'Title must be 120 characters or fewer').optional(),
    content: z.string().trim().min(1, 'Content is required').max(5000, 'Content must be 5000 characters or fewer').optional(),
    imageUrl: z.string().url('Image URL must be a valid URL').optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});
//# sourceMappingURL=post.schema.js.map