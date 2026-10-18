import { Router } from 'express';

import {
	create,
	featured,
	getOne,
	list,
	update,
} from '../music/music.controller.js';

import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get(
	'/featured',
	asyncHandler(featured),
);

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
