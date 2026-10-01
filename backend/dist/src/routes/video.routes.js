import { Router } from 'express';
import { create, getOne, list, update, } from '../videos/video.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';
const router = Router();
router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(getOne));
router.post('/', requireAuth, requireRole('EDITOR', 'ADMIN'), asyncHandler(create));
router.patch('/:id', requireAuth, requireRole('EDITOR', 'ADMIN'), asyncHandler(update));
export default router;
//# sourceMappingURL=video.routes.js.map