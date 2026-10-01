import { Router } from 'express';

import {
  getMe,
  getPublic,
  updateMe,
} from '../profile/profile.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get(
  '/me',
  authenticate,
  asyncHandler(getMe),
);

router.patch(
  '/me',
  authenticate,
  asyncHandler(updateMe),
);

// Keep this BELOW /me so "me" isn't treated as a username.
router.get(
  '/:username',
  asyncHandler(getPublic),
);

export default router;