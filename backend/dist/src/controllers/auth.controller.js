import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { loginUser, registerUser } from '../services/auth.service.js';
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
//# sourceMappingURL=auth.controller.js.map