import { z } from 'zod/v3';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Category name is required' }),
    }),
});