import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../lib/auth.js';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  const token = authorization.slice(7);

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};