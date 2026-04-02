import type { Request, Response, NextFunction } from 'express'
import { dashboardService } from '../services/dashboard.service'

export const dashboardController = {
    getSummary: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await dashboardService.getSummary()
            res.status(200).json({ success: true, data: summary })
        }
        catch (err) {
            next(err)
        }
    },
    getMonthlyTrend: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const trends = await dashboardService.getMonthlyTrends()
            res.status(200).json({ success: true, data: trends })
        } catch (err) {
            next(err)
        }
    }
}