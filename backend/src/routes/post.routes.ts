import { Router } from 'express';

import {
  createNewPost,
  deleteExistingPost,
  getAllPosts,
  getSinglePost,
  updateExistingPost,
} from '../posts/post.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/:id', getSinglePost);
router.post('/', requireAuth, createNewPost);
router.patch('/:id', requireAuth, updateExistingPost);
router.delete('/:id', requireAuth, deleteExistingPost);

export default router;
