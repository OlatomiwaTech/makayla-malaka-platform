import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
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
import eventRoutes from './routes/event.routes.js';
const app = express();
app.disable('x-powered-by');
app.use(helmet({
    crossOriginResourcePolicy: {
        policy: 'cross-origin',
    },
}));
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/events', eventRoutes);
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Makayla Platform API is running',
        timestamp: new Date().toISOString(),
    });
});
const errorHandler = (err, _req, res, _next) => {
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
    if (err instanceof Error &&
        [
            'Email or username is already in use',
            'A user with that email or username already exists.',
        ].includes(err.message)) {
        res.status(409).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err instanceof Error && err.message === 'Invalid or expired password reset code') {
        res.status(400).json({ success: false, message: err.message });
        return;
    }
    if (err instanceof Error &&
        ['Password reset email is not configured', 'Password reset email could not be sent'].includes(err.message)) {
        res.status(503).json({
            success: false,
            message: err.message === 'Password reset email is not configured'
                ? 'Password reset email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in backend/.env, then restart the backend.'
                : 'Password reset email could not be sent. Check the email provider configuration and try again.',
        });
        return;
    }
    if (err instanceof Error &&
        [
            'Admin setup has already been completed',
            'Account not found',
        ].includes(err.message)) {
        res.status(409).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err instanceof Error &&
        [
            'Invalid admin setup key',
            'Admin setup is not configured',
            'The owner admin account cannot be changed here',
        ].includes(err.message)) {
        res.status(403).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err instanceof Error &&
        [
            'Invalid credentials',
            'Invalid email or password.',
            'This account is not active',
            'Invalid refresh token',
            'Refresh token has been revoked',
            'Refresh token has expired',
        ].includes(err.message)) {
        res.status(401).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err instanceof Error &&
        [
            'Invalid YouTube video URL',
            'This YouTube video has already been added',
            'Video not found',
            'YouTube video was not found or is not publicly available',
            'This video is not from Makayla’s official YouTube channel',
            'Could not verify the YouTube channel for this video',
        ].includes(err.message)) {
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
    if (err instanceof Error && err.message === 'Event not found') {
        res.status(404).json({ success: false, message: err.message });
        return;
    }
    if (err instanceof Error && err.message === 'End time must be on or after the start time.') {
        res.status(400).json({ success: false, message: err.message });
        return;
    }
    if (err instanceof Error &&
        err.message === 'YouTube channel verification is not configured') {
        res.status(503).json({
            success: false,
            message: 'YouTube channel verification is not configured. Add YOUTUBE_API_KEY to the backend environment, then restart the backend.',
        });
        return;
    }
    if (err instanceof Error &&
        err.message === 'Configured YouTube channel could not be found') {
        res.status(503).json({
            success: false,
            message: 'Could not find the configured official YouTube channel. Check YOUTUBE_CHANNEL_HANDLE or set its stable ID in YOUTUBE_CHANNEL_ID.',
        });
        return;
    }
    if (err instanceof Error &&
        err.message.startsWith('YouTube metadata request failed')) {
        res.status(502).json({
            success: false,
            message: `${err.message}. The video may be unavailable, or the YouTube Data API key/quota may need attention.`,
        });
        return;
    }
    if (err instanceof Error &&
        [
            'YouTube metadata service is unreachable',
            'YouTube metadata request timed out',
            'YouTube metadata service returned an invalid response',
        ].includes(err.message)) {
        res.status(502).json({
            success: false,
            message: 'Could not verify this video with YouTube. Check that the backend can make outbound HTTPS requests to www.googleapis.com. The video was not added; try again when the YouTube API is reachable.',
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
//# sourceMappingURL=app.js.map