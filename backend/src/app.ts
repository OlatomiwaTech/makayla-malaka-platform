import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';

import { env } from './config/env.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import musicRoutes from './routes/music.routes.js';
import postRoutes from './routes/post.routes.js';
import profileRoutes from './routes/profile.routes.js';
import videoRoutes from './routes/video.routes.js';

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
app.use('/api/admin', adminRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/videos', videoRoutes);

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
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });

    return;
  }

  if (
    err instanceof Error &&
    [
      'Email or username is already in use',
      'A user with that email or username already exists.',
    ].includes(err.message)
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
      'Admin setup has already been completed',
      'Account not found',
    ].includes(err.message)
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
      'Invalid admin setup key',
      'Admin setup is not configured',
      'The owner admin account cannot be changed here',
    ].includes(err.message)
  ) {
    res.status(403).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (
    err instanceof Error &&
    [
      'Invalid credentials',
      'Invalid email or password.',
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

  if (
    err instanceof Error &&
    [
      'Invalid YouTube video URL',
      'This YouTube video has already been added',
      'Video not found',
      'YouTube video was not found or is not publicly available',
    ].includes(err.message)
  ) {
    res.status(400).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (err instanceof Error && err.message === 'Music release not found') {
    res.status(404).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (
    err instanceof Error &&
    err.message.startsWith('YouTube metadata request failed')
  ) {
    res.status(502).json({
      success: false,
      message: `${err.message}. The video may be unavailable, or the YouTube Data API key/quota may need attention.`,
    });

    return;
  }

  if (
    err instanceof Error &&
    [
      'YouTube metadata service is unreachable',
      'YouTube metadata request timed out',
      'YouTube metadata service returned an invalid response',
    ].includes(err.message)
  ) {
    res.status(502).json({
      success: false,
      message: 'Could not reach YouTube to analyze this link. Check that the backend can make outbound HTTPS requests to www.youtube.com. If using YOUTUBE_API_KEY, allow www.googleapis.com too. You can still add the video by entering its title manually; a standard thumbnail will be generated.',
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
