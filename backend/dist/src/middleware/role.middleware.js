export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication is required.',
            });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
            });
        }
        return next();
    };
};
//# sourceMappingURL=role.middleware.js.map