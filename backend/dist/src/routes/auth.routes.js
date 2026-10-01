import { Router } from 'express';

import {
  login,
  logout,
  me,
  refresh,
  register,
} from '../auth/auth.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', authenticate, me);

export default router;