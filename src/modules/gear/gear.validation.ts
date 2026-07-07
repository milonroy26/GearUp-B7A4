import { z } from 'zod/v3';

export const createGearSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }),
        description: z.string({ required_error: 'Description is required' }),
        brand: z.string({ required_error: 'Brand is required' }),
        pricePerDay: z.number({ required_error: 'Price per day is required' }).positive(),
        stock: z.number({ required_error: 'Stock is required' }).int().nonnegative(),
        categoryId: z.string({ required_error: 'Category ID is required' }),
    }),
});

export const updateGearSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        brand: z.string().optional(),
        pricePerDay: z.number().positive().optional(),
        stock: z.number().int().nonnegative().optional(),
        isAvailable: z.boolean().optional(),
    }),
});


export type TCreateGear = z.infer<typeof createGearSchema>['body'];
export type TUpdateGear = z.infer<typeof updateGearSchema>['body'];