import { z } from 'zod';
export const updateContentRoleSchema = z.object({
    role: z.enum(['FAN', 'MEDIA_EDITOR']),
});
//# sourceMappingURL=admin.schema.js.map