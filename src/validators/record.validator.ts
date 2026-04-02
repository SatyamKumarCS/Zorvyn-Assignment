import { z } from 'zod'

export const createRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive("Amount Must be Positive"),
        type: z.enum(['INCOME', 'EXPENSE']),
        category: z.string().min(1, 'Category is missing'),
        date: z.iso.datetime({ error: 'Invalid date format' }),
        description: z.string().optional(),
    })
})

export const updateRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive().optional(),
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().min(1).optional(),
        date: z.iso.datetime().optional(),
        description: z.string().optional()
    })
})

export const filterRecordSchema = z.object({
    query: z.object({
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>['body'];
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>['body'];
export type FilterRecordInput = z.infer<typeof filterRecordSchema>['query'];