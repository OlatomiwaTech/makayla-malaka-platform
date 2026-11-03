import type { Request, RequestHandler } from 'express';

import type { UserRole } from '../../generated/prisma/client.js';
import { verifyToken } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from './async-handler.js';
import type { AuthTokenPayload } from '../types/auth.js';

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: UserRole;
  };
};

export const requireAuth: RequestHandler = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is required.',
    });
    return;
  }

  let payload: AuthTokenPayload;
  try {
    const token = authorization.replace('Bearer ', '').trim();
    payload = verifyToken(token);
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
    return;
  }

  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true, status: true },
  });

  if (!user || user.status !== 'ACTIVE') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
    return;
  }

  (req as AuthenticatedRequest).user = {
    id: user.id,
    role: user.role,
  };

  return next();
});
