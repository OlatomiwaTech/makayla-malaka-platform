import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
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
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Makayla Platform API is running',
        timestamp: new Date().toISOString(),
    });
});
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map