import { z } from 'zod';
const optionalUrl = z.union([z.string().trim().url(), z.literal('')]).optional();
const optionalEndDate = z.preprocess((value) => value === null || value === '' ? null : value, z.union([z.coerce.date(), z.null()]).optional());
const eventFields = {
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000).optional(),
    imageUrl: optionalUrl,
    location: z.string().trim().max(300).optional(),
    startsAt: z.coerce.date(),
    endsAt: optionalEndDate,
    registrationUrl: optionalUrl,
    status: z.enum(['DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
};
const eventDateCheck = (value, context) => {
    if (value.startsAt && value.endsAt && value.endsAt < value.startsAt) {
        context.addIssue({ code: 'custom', path: ['endsAt'], message: 'End time must be on or after the start time.' });
    }
};
export const createEventSchema = z.object(eventFields).superRefine(eventDateCheck);
export const updateEventSchema = z.object({
    ...eventFields,
    status: eventFields.status.optional(),
}).partial().superRefine(eventDateCheck);
export const updateEventStatusSchema = z.object({ status: z.enum(['DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']) });
export const publicEventListQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    period: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
});
export const managedEventListQuerySchema = publicEventListQuerySchema.extend({
    period: z.enum(['upcoming', 'past', 'all']).optional(),
    status: z.enum(['DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
    search: z.string().trim().max(200).optional(),
});
//# sourceMappingURL=event.schema.js.map