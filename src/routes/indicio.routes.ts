import { Router } from 'express';
import {
  listarIndiciosPorExpediente,
  crearIndicio,
  actualizarIndicio,
  activarDesactivarIndicio
} from '../controllers/indicio.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { indicioSchema } from '../validations/indicio.validation';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route GET /expedientes/:expedienteId/indicios
 * @desc Obtener indicios de un expediente específico
 * @access Técnico (solo sus expedientes) y Coordinador (todos)
 */
router.get('/expedientes/:expedienteId/indicios', listarIndiciosPorExpediente);

/**
 * @route POST /expedientes/:expedienteId/indicios
 * @desc Crear un nuevo indicio en un expediente
 * @access Solo Técnico (solo en sus expedientes)
 */
router.post('/expedientes/:expedienteId/indicios', requireRole(['tecnico']), validate(indicioSchema), crearIndicio);

/**
 * @route PUT /indicios/:id
 * @desc Actualizar un indicio existente
 * @access Técnico (solo sus indicios) y Coordinador (todos)
 */
router.put('/:id', validate(indicioSchema), actualizarIndicio);

/**
 * @route PATCH /indicios/:id/activo
 * @desc Activar/desactivar indicio (soft delete)
 * @access Técnico (solo sus indicios) y Coordinador (todos)
 */
router.patch('/:id/activo', activarDesactivarIndicio);

export default router;