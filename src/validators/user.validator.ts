import { z } from 'zod';

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
        isActive: z.boolean().optional(),
    }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];