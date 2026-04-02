import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import type { RegisterInput, LoginInput } from '../validators/auth.validator'

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.register(req.body as RegisterInput)
            res.status(201).json({ success: true, message: "User Registered Successfully", data: result })
        } catch (err) {
            next(err)
        }
    },
    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.login(req.body as LoginInput)
            res.status(200).json({ success: true, message: "User Login Successfully", data: result })
        } catch (err) {
            next(err)
        }
    }
}