import { Router } from 'express';

import { getMyProfile, getPublicProfile, updateMyProfile } from '../services/profile.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { updateProfileSchema } from '../schemas/profile.schema.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required.',
    });
  }

  const profile = await getMyProfile(user.id);

  return res.status(200).json({
    success: true,
    profile,
  });
}));

router.patch('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required.',
    });
  }

  const parsed = updateProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const profile = await updateMyProfile(user.id, parsed.data);

  return res.status(200).json({
    success: true,
    profile,
  });
}));

router.get('/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;
  const profile = await getPublicProfile(username);

  return res.status(200).json({
    success: true,
    profile,
  });
}));

export default router;
