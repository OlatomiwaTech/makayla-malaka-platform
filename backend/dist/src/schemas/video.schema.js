import { z } from 'zod';
export const createVideoSchema = z.object({
    youtubeVideoId: z
        .string()
        .trim()
        .min(1)
        .max(20),
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
    thumbnailUrl: z
        .string()
        .url()
        .optional(),
    videoUrl: z
        .string()
        .url(),
    category: z
        .string()
        .trim()
        .min(1)
        .max(50),
    status: z
        .enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
        .default('DRAFT'),
});
export const updateVideoSchema = createVideoSchema.partial();
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
//# sourceMappingURL=video.schema.js.map