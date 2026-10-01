import { verifyToken } from '../lib/auth.js';
export const requireAuth = (req, res, next) => {
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
        req.user = payload;
        return next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map