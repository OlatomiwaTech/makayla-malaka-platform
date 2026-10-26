import { Router } from 'express';
import { changeStatus, create, getManaged, getPublic, listManaged, listPublic, update } from '../events/event.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();
const eventManagers = [requireAuth, requireRole('EDITOR', 'ADMIN')];

router.get('/manage', ...eventManagers, asyncHandler(listManaged));
router.get('/manage/:id', ...eventManagers, asyncHandler(getManaged));
router.post('/', ...eventManagers, asyncHandler(create));
router.patch('/:id/status', ...eventManagers, asyncHandler(changeStatus));
router.patch('/:id', ...eventManagers, asyncHandler(update));
router.get('/', asyncHandler(listPublic));
router.get('/:id', asyncHandler(getPublic));

export default router;
