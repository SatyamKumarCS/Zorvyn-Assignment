import type { Request, Response, NextFunction } from 'express'
import { Role } from '../generated/prisma'
import { success } from 'zod'

export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized User" })
            return
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: "You do not have permission to perform this action" })
            return
        }
        next()
    }
}