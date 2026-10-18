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
const tracksSchema = z
    .array(trackSchema)
    .min(1)
    .superRefine((tracks, context) => {
    const trackNumbers = new Set();
    tracks.forEach((track, index) => {
        if (trackNumbers.has(track.trackNumber)) {
            context.addIssue({
                code: 'custom',
                path: [index, 'trackNumber'],
                message: 'Track numbers must be unique.',
            });
        }
        trackNumbers.add(track.trackNumber);
    });
});
export const createReleaseSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(150),
    artistName: z
        .string()
        .trim()
        .min(1)
        .max(150)
        .default('Makayla Malaka'),
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
    tracks: tracksSchema,
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
export const managedMusicListQuerySchema = musicListQuerySchema
    .extend({
    status: z.enum([
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED',
    ]).optional(),
    type: z.enum([
        'SINGLE',
        'EP',
        'ALBUM',
    ]).optional(),
    search: z.string().trim().max(150).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
})
    .refine((query) => !query.dateFrom ||
    !query.dateTo ||
    query.dateFrom <= query.dateTo, {
    message: 'The start date must be on or before the end date.',
    path: ['dateTo'],
});
//# sourceMappingURL=music.schema.js.map