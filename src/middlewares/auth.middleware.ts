import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token de acceso requerido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const pool = getDB();
    
    // Verificar que el usuario aún existe y está activo
    const result = await pool.request()
      .input('id', sql.Int, decoded.id)
      .query('SELECT id, nombre, email, rol FROM Usuarios WHERE id = @id AND activo = 1');
    
    if (result.recordset.length === 0) {
      res.status(401).json({ message: 'Usuario no válido' });
      return;
    }

    req.user = result.recordset[0];
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};