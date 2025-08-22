import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'GestionExpedientes',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool;

export const connectDB = async (): Promise<void> => {
  try {
    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    console.log('Conexión a SQL Server establecida correctamente');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

export const getDB = (): sql.ConnectionPool => {
  if (!pool) {
    throw new Error('La base de datos no está inicializada');
  }
  return pool;
};