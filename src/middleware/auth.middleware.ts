import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.util'

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(401).json({ success: false, message: "No token provided" })

            return
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            res.status(401).json({ success: false, message: "Invalid authorization header format" })
            return
        }

        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" })
    }
}