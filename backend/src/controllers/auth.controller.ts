import type { NextFunction, Request, Response } from 'express';

import {
  bootstrapAdminSchema,
  loginSchema,
  registerSchema,
} from '../schemas/auth.schema.js';
import {
  bootstrapAdmin,
  getAdminSetupStatus,
  loginUser,
  registerUser,
} from '../services/auth.service.js';

export const adminSetupStatus = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({
      success: true,
      data: await getAdminSetupStatus(),
    });
  } catch (error) {
    return next(error);
  }
};

export const bootstrapAdminAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = bootstrapAdminSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const authResponse = await bootstrapAdmin(parsed.data);

    return res.status(201).json({
      success: true,
      ...authResponse,
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const authResponse = await registerUser(parsed.data);

    return res.status(201).json({
      success: true,
      ...authResponse,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const authResponse = await loginUser(parsed.data);

    return res.status(200).json({
      success: true,
      ...authResponse,
    });
  } catch (error) {
    return next(error);
  }
};
