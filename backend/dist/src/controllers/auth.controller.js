import { bootstrapAdminSchema, loginSchema, passwordResetRequestSchema, passwordResetVerifySchema, registerSchema, } from '../schemas/auth.schema.js';
import { bootstrapAdmin, getAdminSetupStatus, loginUser, requestAdminPasswordReset, completeAdminPasswordReset, registerUser, } from '../services/auth.service.js';
export const adminSetupStatus = async (_req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            data: await getAdminSetupStatus(),
        });
    }
    catch (error) {
        return next(error);
    }
};
export const bootstrapAdminAccount = async (req, res, next) => {
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
    }
    catch (error) {
        return next(error);
    }
};
export const register = async (req, res, next) => {
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
    }
    catch (error) {
        return next(error);
    }
};
export const login = async (req, res, next) => {
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
    }
    catch (error) {
        return next(error);
    }
};
export const requestPasswordReset = async (req, res, next) => {
    try {
        const parsed = passwordResetRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
        }
        await requestAdminPasswordReset(parsed.data);
        return res.status(200).json({
            success: true,
            message: 'If that email belongs to an active content manager, a one-time code has been sent.',
        });
    }
    catch (error) {
        return next(error);
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        const parsed = passwordResetVerifySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, message: 'Enter a valid email, six-digit code, and password of at least 12 characters.' });
        }
        await completeAdminPasswordReset(parsed.data);
        return res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' });
    }
    catch (error) {
        return next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map