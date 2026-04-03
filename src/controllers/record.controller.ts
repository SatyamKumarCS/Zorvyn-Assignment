import type { Request, Response, NextFunction } from 'express'
import { recordService } from '../services/record.service'
import { RecordType } from '../types/enums'


export const recordController = {
    createRecord: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await recordService.createRecord(req.body, req.user!.id)
            res.status(201).json({ success: true, message: "Record Created Successfully", data: result })
        } catch (err) {
            next(err)
        }
    },
    getAllRecord: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { type, category, startDate, endDate, page, limit, search } = req.query
            const result = await recordService.getAllRecords({
                type: type as RecordType | undefined,
                category: category as string | undefined,
                startDate: startDate as string | undefined,
                endDate: endDate as string | undefined,
                search: search as string | undefined
            },
                page ? parseInt(page as string) : undefined,
                limit ? parseInt(limit as string) : undefined
            )
            res.status(200).json({ success: true, data: result })
        } catch (err) {
            next(err)
        }
    },
    getRecordById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await recordService.getRecordById(req.params.id as string)
            res.status(200).json({ success: true, data: result })
        } catch (err) {
            next(err)
        }
    },
    updateRecord: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await recordService.updateRecord(req.params.id as string, req.body)
            res.status(200).json({ success: true, message: 'Record Updated Successfully', data: result })
        } catch (err) {
            next(err)
        }
    },
    deleteRecord: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await recordService.deleteRecord(req.params.id as string)
            res.status(200).json({ success: true, message: 'Record Deleted Successfully' })
        } catch (err) {
            next(err)
        }
    }
}