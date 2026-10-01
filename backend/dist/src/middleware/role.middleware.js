import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import type { UserRole } from '../../generated/prisma/client.js';

export const requireRoles = (
  ...allowedRoles: UserRole[]
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });

      return;
    }

    next();
  };
};