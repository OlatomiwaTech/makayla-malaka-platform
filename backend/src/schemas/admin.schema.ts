import { z } from 'zod';

export const updateContentRoleSchema = z.object({
  role: z.enum(['FAN', 'EDITOR']),
});

export type UpdateContentRoleInput = z.infer<typeof updateContentRoleSchema>;
