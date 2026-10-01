import { z } from 'zod';
export const registerSchema = z.object({
    email: z.email('Please enter a valid email address.'),
    username: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters long.')
        .max(30, 'Username must be at most 30 characters long.')
        .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, underscores, dots, and dashes.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.').max(128),
    displayName: z.string().trim().min(2).max(50).optional(),
    bio: z.string().trim().max(250).optional(),
});
export const loginSchema = z.object({
    email: z.email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.').max(128),
});
//# sourceMappingURL=auth.schema.js.map