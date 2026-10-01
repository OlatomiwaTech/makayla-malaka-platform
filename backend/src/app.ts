import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';

import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import musicRoutes from './routes/music.routes.js';
import postRoutes from './routes/post.routes.js';
import profileRoutes from './routes/profile.routes.js';

const app = express();

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  }),
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Makayla Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });

    return;
  }

  if (
    err instanceof Error &&
    err.message === 'Email or username is already in use'
  ) {
    res.status(409).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (
    err instanceof Error &&
    [
      'Invalid credentials',
      'This account is not active',
      'Invalid refresh token',
      'Refresh token has been revoked',
      'Refresh token has expired',
    ].includes(err.message)
  ) {
    res.status(401).json({
      success: false,
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

app.use(errorHandler);

export default app;