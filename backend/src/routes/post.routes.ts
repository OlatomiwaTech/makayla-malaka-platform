import { Router } from 'express';

import {
  create,
  getOne,
  list,
  remove,
  update,
} from '../posts/post.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', list);
router.get('/:id', getOne);
router.post('/', requireAuth, create);
router.patch('/:id', requireAuth, update);
router.delete('/:id', requireAuth, remove);

export default router;
