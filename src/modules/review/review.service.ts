import httpStatus from 'http-status';
import { AppError } from '../../interfaces/customError';
import { prisma } from '../../lib/prisma';

//* Create review
const createReviewInDB = async (customerId: string, payload: { gearItemId: string; rating: number; comment: string }) => {

    // user has rented this gear or not
    const hasRented = await prisma.rentalOrder.findFirst({
        where: {
            customerId,
            status: "PAID", //or RETURNED 
            orderItems: {
                some: { gearItemId: payload.gearItemId }
            }
        }
    });

    if (!hasRented) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You can only review products you have rented and returned or paid for.');
    }

    return await prisma.review.create({
        data: {
            customerId,
            gearItemId: payload.gearItemId,
            rating: Number(payload.rating),
            comment: payload.comment,
        },
    });
};

//* Get gear reviews
const getGearReviewsFromDB = async (gearItemId: string) => {
    return await prisma.review.findMany({
        where: { gearItemId },
        include: {
            customer: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const ReviewServices = {
    createReviewInDB,
    getGearReviewsFromDB,
};