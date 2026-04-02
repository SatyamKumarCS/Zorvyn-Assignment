import type { Request, Response, NextFunction } from 'express'
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: err.issues.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(err)
        }
    }
}