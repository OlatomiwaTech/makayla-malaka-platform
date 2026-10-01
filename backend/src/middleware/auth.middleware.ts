import type { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../lib/auth.js';
import type { UserRole } from '../../generated/prisma/client.js';

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: UserRole;
  };
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required.',
    });
  }

  try {
    const token = authorization.replace('Bearer ', '').trim();
    const payload = verifyToken(token);

    (req as AuthenticatedRequest).user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
