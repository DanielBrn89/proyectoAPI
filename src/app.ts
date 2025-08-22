import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import expedienteRoutes from './routes/expediente.routes';
import indicioRoutes from './routes/indicio.routes';
import usuarioRoutes from './routes/usuario.routes';
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/expedientes', expedienteRoutes);
app.use('/indicios', indicioRoutes);
app.use('/usuarios', usuarioRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Error handling middleware
app.use(errorMiddleware);

// Connect to database
connectDB();

export default app;