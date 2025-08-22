import { Router } from 'express';
import {
  listarUsuarios,
  crearUsuario
} from '../controllers/usuario.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { usuarioSchema } from '../validations/usuario.validation';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route GET /usuarios
 * @desc Obtener listado de usuarios (opcional)
 * @access Solo Coordinador
 */
router.get('/', requireRole(['coordinador']), listarUsuarios);

/**
 * @route POST /usuarios
 * @desc Crear un nuevo usuario
 * @access Solo Coordinador
 */
router.post('/', requireRole(['coordinador']), validate(usuarioSchema), crearUsuario);

export default router;