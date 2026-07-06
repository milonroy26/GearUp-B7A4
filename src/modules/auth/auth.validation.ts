import { z } from 'zod/v3';

export const registerSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        role: z.enum(['CUSTOMER', 'PROVIDER']), // register time allow only customer and provider
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: z.string({ required_error: 'Password is required' }),
    })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];