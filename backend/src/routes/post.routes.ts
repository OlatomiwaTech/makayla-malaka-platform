import { Router } from 'express';

import {
  create,
  getOne,
  list,
  update,
} from '../posts/post.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { requireRoles } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(list),
);

router.get(
  '/:id',
  asyncHandler(getOne),
);

router.post(
  '/',
  authenticate,
  requireRoles('EDITOR', 'ADMIN'),
  asyncHandler(create),
);

router.patch(
  '/:id',
  authenticate,
  requireRoles('EDITOR', 'ADMIN'),
  asyncHandler(update),
);

export default router;