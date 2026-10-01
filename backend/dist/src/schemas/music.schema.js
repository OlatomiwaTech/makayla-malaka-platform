import { z } from 'zod';
const trackSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(150),
    trackNumber: z
        .number()
        .int()
        .positive(),
    durationSeconds: z
        .number()
        .int()
        .positive()
        .optional(),
    previewUrl: z
        .string()
        .url()
        .optional(),
});
const platformLinkSchema = z.object({
    platform: z
        .string()
        .trim()
        .min(1)
        .max(40),
    url: z
        .string()
        .url(),
});
export const createReleaseSchema = z.object({
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
    coverUrl: z
        .string()
        .url()
        .optional(),
    releaseDate: z
        .coerce
        .date(),
    type: z.enum([
        'SINGLE',
        'EP',
        'ALBUM',
    ]),
    status: z
        .enum([
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED',
    ])
        .default('DRAFT'),
    isFeatured: z
        .boolean()
        .default(false),
    tracks: z
        .array(trackSchema)
        .min(1),
    links: z
        .array(platformLinkSchema)
        .default([]),
});
export const updateReleaseSchema = createReleaseSchema.partial();
export const musicListQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .positive()
        .default(1),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(50)
        .default(12),
});
//# sourceMappingURL=music.schema.js.map