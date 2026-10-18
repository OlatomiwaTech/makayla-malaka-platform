import { Router } from 'express';

import {
  create,
  getOne,
  list,
  preview,
  update,
} from '../videos/video.controller.js';

import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/', asyncHandler(list));

router.get(
  '/preview',
  requireAuth,
  requireRole('MEDIA_EDITOR', 'EDITOR', 'ADMIN'),
  asyncHandler(preview),
);

router.get(
  '/:id',
  asyncHandler(getOne),
);

router.post(
  '/',
  requireAuth,
  requireRole('MEDIA_EDITOR', 'EDITOR', 'ADMIN'),
  asyncHandler(create),
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('MEDIA_EDITOR', 'EDITOR', 'ADMIN'),
  asyncHandler(update),
);

export default router;
