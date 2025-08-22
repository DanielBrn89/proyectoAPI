import { Router } from 'express';
import {
  listarExpedientes,
  obtenerExpediente,
  crearExpediente,
  actualizarExpediente,
  cambiarEstadoExpediente,
  activarDesactivarExpediente
} from '../controllers/expediente.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { expedienteSchema, estadoExpedienteSchema } from '../validations/expediente.validation';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route GET /expedientes
 * @desc Obtener listado de expedientes (paginado y filtrado)
 * @access Técnico y Coordinador
 */
router.get('/', listarExpedientes);

/**
 * @route GET /expedientes/:id
 * @desc Obtener un expediente específico
 * @access Técnico (solo sus expedientes) y Coordinador (todos)
 */
router.get('/:id', obtenerExpediente);

/**
 * @route POST /expedientes
 * @desc Crear un nuevo expediente
 * @access Solo Técnico
 */
router.post('/', requireRole(['tecnico']), validate(expedienteSchema), crearExpediente);

/**
 * @route PUT /expedientes/:id
 * @desc Actualizar un expediente existente
 * @access Técnico (solo sus expedientes) y Coordinador (todos)
 */
router.put('/:id', validate(expedienteSchema), actualizarExpediente);

/**
 * @route PATCH /expedientes/:id/estado
 * @desc Cambiar estado de aprobación de un expediente
 * @access Solo Coordinador
 */
router.patch('/:id/estado', requireRole(['coordinador']), validate(estadoExpedienteSchema), cambiarEstadoExpediente);

/**
 * @route PATCH /expedientes/:id/activo
 * @desc Activar/desactivar expediente (soft delete)
 * @access Técnico (solo sus expedientes) y Coordinador (todos)
 */
router.patch('/:id/activo', activarDesactivarExpediente);

export default router;