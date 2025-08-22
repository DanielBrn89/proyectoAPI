import { Request, Response } from 'express';
import sql from 'mssql';
import { getDB } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const listarExpedientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pagina = 1, limite = 10, tecnico_id, estado } = req.query;
    const offset = (Number(pagina) - 1) * Number(limite);
    
    const pool = getDB();
    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limite', sql.Int, Number(limite))
      .input('tecnico_id', sql.Int, tecnico_id || null)
      .input('estado', sql.NVarChar, estado || null)
      .execute('sp_Expedientes_Listar');
    
    res.json({
      expedientes: result.recordset,
      paginacion: {
        pagina: Number(pagina),
        limite: Number(limite),
        total: result.recordset.length > 0 ? result.recordset[0].total : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener expedientes', error });
  }
};

export const obtenerExpediente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pool = getDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .execute('sp_Expedientes_Obtener');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Expediente no encontrado' });
      return;
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el expediente', error });
  }
};

export const crearExpediente = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, descripcion } = req.body;
    const tecnico_id = req.user.id;
    
    const pool = getDB();
    const result = await pool.request()
      .input('codigo', sql.NVarChar, codigo)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('tecnico_id', sql.Int, tecnico_id)
      .execute('sp_Expedientes_Crear');
    
    res.status(201).json({ 
      message: 'Expediente creado correctamente',
      id: result.recordset[0].id
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      res.status(400).json({ message: 'El código del expediente ya existe' });
    } else {
      res.status(500).json({ message: 'Error al crear el expediente', error });
    }
  }
};

// Implementar más funciones: actualizar, cambiarEstado, activarDesactivar