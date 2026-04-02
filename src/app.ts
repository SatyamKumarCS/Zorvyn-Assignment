import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recordRoutes from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'API is running' })
});

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

export default app;