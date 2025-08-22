import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import sql from 'mssql';
import { getDB } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = getDB();
    const result = await pool.request()
      .query('SELECT id, nombre, email, rol, activo FROM Usuarios WHERE activo = 1');

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

export const crearUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, rol } = req.body;
    const pool = getDB();

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('email', sql.NVarChar, email)
      .input('password_hash', sql.NVarChar, passwordHash)
      .input('rol', sql.NVarChar, rol)
      .execute('sp_Usuarios_Crear');

    res.status(201).json({ 
      message: 'Usuario creado correctamente',
      id: result.recordset[0].id
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      res.status(400).json({ message: 'El email ya está registrado' });
    } else {
      res.status(500).json({ message: 'Error al crear el usuario', error });
    }
  }
};