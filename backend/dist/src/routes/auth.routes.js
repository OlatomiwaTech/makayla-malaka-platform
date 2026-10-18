import { Router } from 'express';
import { adminSetupStatus, bootstrapAdminAccount, login, register, } from '../controllers/auth.controller.js';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/setup-status', adminSetupStatus);
router.post('/bootstrap-admin', bootstrapAdminAccount);
export default router;
//# sourceMappingURL=auth.routes.js.map