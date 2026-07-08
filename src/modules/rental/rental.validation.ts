import { z } from 'zod/v3';

export const createRentalOrderSchema = z.object({
    body: z.object({
        startDate: z.string({ required_error: 'Start date is required' }).datetime(),
        endDate: z.string({ required_error: 'End date is required' }).datetime(),
        items: z.array(
            z.object({
                gearItemId: z.string({ required_error: 'Gear Item ID is required' }),
                quantity: z.number({ required_error: 'Quantity is required' }).int().positive(),
            })
        ).min(1, 'At least one gear item must be selected'),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(['CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED'], {
            required_error: 'Valid status is required',
        }),
    }),
});

export type CreateRentalOrderInput = z.infer<typeof createRentalOrderSchema>['body'];
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>['body'];