import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { listAccounts, updateAccountRole } from '../controllers/admin.controller.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));
router.get('/accounts', asyncHandler(listAccounts));
router.patch('/accounts/:id/role', asyncHandler(updateAccountRole));

export default router;
