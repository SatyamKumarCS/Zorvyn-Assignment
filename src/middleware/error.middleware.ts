import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    logger.error(`${req.method} ${req.path} - ${statusCode} - ${message}`);
    res.status(statusCode).json({
        success: false, message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}

export const notFound = (req: Request, res: Response): void => {
    res.status(400).json({ success: false, message: `Route ${req.method} ${req.path} not found` })
}