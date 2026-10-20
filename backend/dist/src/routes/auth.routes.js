import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { adminSetupStatus, bootstrapAdminAccount, login, requestPasswordReset, register, resetPassword, } from '../controllers/auth.controller.js';
const router = Router();
const passwordResetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many password reset attempts. Please wait and try again.' },
});
router.post('/register', register);
router.post('/login', login);
router.post('/password-reset/request', passwordResetLimiter, requestPasswordReset);
router.post('/password-reset/verify', passwordResetLimiter, resetPassword);
router.get('/setup-status', adminSetupStatus);
router.post('/bootstrap-admin', bootstrapAdminAccount);
export default router;
//# sourceMappingURL=auth.routes.js.map