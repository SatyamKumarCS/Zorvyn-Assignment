import type { Request, Response, NextFunction } from 'express'
import { userService } from '../services/user.service'


export const userController = {
    getAllUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await userService.getAllUsers()
            res.status(200).json({ success: true, data: users })
        } catch (err) {
            next(err)
        }
    },
    getUserById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await userService.getUserById(req.params.id as string)
            res.status(200).json({ success: true, data: users })
        }
        catch (err) {
            next(err)
        }
    },
    updateUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await userService.updateUser(req.params.id as string, req.body);
            res.status(200).json({
                success: true, message: 'User updated successfully', data: user,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await userService.deleteUser(req.params.id as string)
            res.status(200).json({ success: true, message: "User Deleted Successfully" })
        } catch (err) {
            next(err)
        }
    }
}