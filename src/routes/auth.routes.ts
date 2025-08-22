import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validations/auth.validation';

const router = Router();

/**
 * @route POST /auth/login
 * @desc Autenticar usuario y obtener token JWT
 * @access Public
 */
router.post('/login', validate(loginSchema), login);

export default router;