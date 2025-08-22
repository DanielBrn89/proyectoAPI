import { Request, Response } from 'express';
import sql from 'mssql';
import { getDB } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const listarIndiciosPorExpediente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expedienteId } = req.params;
    const pool = getDB();

    const result = await pool.request()
      .input('expediente_id', sql.Int, expedienteId)
      .execute('sp_Indicios_ListarPorExpediente');

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener indicios', error });
  }
};

export const crearIndicio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { expedienteId } = req.params;
    const { codigo, descripcion, peso, color, tamano } = req.body;
    const pool = getDB();

    const result = await pool.request()
      .input('codigo', sql.NVarChar, codigo)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('peso', sql.Decimal(10, 2), peso)
      .input('color', sql.NVarChar, color)
      .input('tamano', sql.NVarChar, tamano)
      .input('expediente_id', sql.Int, expedienteId)
      .execute('sp_Indicios_Crear');

    res.status(201).json({ 
      message: 'Indicio creado correctamente',
      id: result.recordset[0].id
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      res.status(400).json({ message: 'El código del indicio ya existe' });
    } else {
      res.status(500).json({ message: 'Error al crear el indicio', error });
    }
  }
};

export const actualizarIndicio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { descripcion, peso, color, tamano } = req.body;
    const pool = getDB();

    await pool.request()
      .input('id', sql.Int, id)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('peso', sql.Decimal(10, 2), peso)
      .input('color', sql.NVarChar, color)
      .input('tamano', sql.NVarChar, tamano)
      .execute('sp_Indicios_Actualizar');

    res.json({ message: 'Indicio actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el indicio', error });
  }
};

export const activarDesactivarIndicio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    const pool = getDB();

    await pool.request()
      .input('id', sql.Int, id)
      .input('activo', sql.Bit, activo)
      .execute('sp_Indicios_ActivarDesactivar');

    res.json({ message: `Indicio ${activo ? 'activado' : 'desactivado'} correctamente` });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado del indicio', error });
  }
};