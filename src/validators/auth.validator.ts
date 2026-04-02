import { z } from 'zod';

export const role = z.enum(["VIEWER", "ANALYST", "ADMIN"])

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters" }),
        email: z.email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        role: role.optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password is required" }),
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];