import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../middleware/validation.middleware.js';

const router = Router();

// Public routes
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Protected routes
router.get('/profile', authenticateUser, AuthController.getProfile);
router.post('/logout', authenticateUser, AuthController.logout);

export default router;