import httpStatus from 'http-status';
import { OrderStatus } from '../../../generated/prisma/enums';
import { AppError } from "../../interfaces/customError";
import { prisma } from '../../lib/prisma';
import { CreateRentalOrderInput } from './rental.validation';

//* Create rental order
const createRentalOrderInDB = async (customerId: string, payload: CreateRentalOrderInput) => {

    const { startDate, endDate, items } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    //*Calculate rental days (at least 1 day)
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (totalDays <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'End date must be after start date');
    }

    //* Prisma transaction start
    return await prisma.$transaction(async (tx) => {

        let calculatedTotalPrice = 0;
        const orderItemsData = [];

        for (const item of items) {

            //* check if gear item and stock is available
            const gear = await tx.gearItem.findUnique({
                where: { id: item.gearItemId },
            });

            if (!gear) {
                throw new AppError(httpStatus.NOT_FOUND, `Gear item with ID ${item.gearItemId} not found`);
            }

            if (!gear.isAvailable || gear.stock < item.quantity) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `Not enough stock for ${gear.title}. Available: ${gear.stock}`
                );
            }

            //* stock update (minus)
            const newStock = gear.stock - item.quantity;
            await tx.gearItem.update({
                where: { id: gear.id },
                data: {
                    stock: newStock,
                    isAvailable: newStock > 0,
                },
            });

            //* price calculation
            calculatedTotalPrice += gear.pricePerDay * totalDays * item.quantity;

            //*Preparing the junction table data
            orderItemsData.push({
                gearItemId: item.gearItemId,
                quantity: item.quantity,
            });

        }

        //* Rental order creation
        const newOrder = await tx.rentalOrder.create({
            data: {
                customerId,
                startDate: start,
                endDate: end,
                totalPrice: calculatedTotalPrice,
                status: OrderStatus.PLACED,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: {
                orderItems: true,
            },
        });

        return newOrder;

    });

};

//* Get Customer Orders
const getCustomerOrdersFromDB = async (customerId: string) => {

    const result = await prisma.rentalOrder.findMany({
        where: {
            customerId,
        },
        include: {
            orderItems: {
                include: {
                    gearItem: true
                }
            }
        }
    })

    return result

}

//* Return Gear Order
const returnGearFromOrderInDB = async (orderId: string) => {
    const result = await prisma.rentalOrder.update({
        where: {
            id: orderId
        },
        data: {
            status: OrderStatus.RETURNED
        }
    })

    return result
}

//* Get Provider Orders
const getProviderOrdersFromDB = async (providerId: string) => {
    //The provider will only see orders that have gear in its own inventory.
    const result = await prisma.rentalOrder.findMany({
        where: {
            orderItems: {
                some: {
                    gearItem: {
                        providerId
                    }
                }
            }
        },
        include: {
            customer: {
                select: {
                    name: true,
                    email: true
                }
            },
            orderItems: {
                where: {
                    gearItem: {
                        providerId
                    }
                },
                include: {
                    gearItem: true
                },
            },
        },
    });

    return result
}


//* Update Order Status
const updateOrderStatusInDB = async (orderId: string, status: OrderStatus) => {
    return await prisma.rentalOrder.update({
        where: {
            id: orderId
        },
        data: {
            status
        }
    })
}

export const RentalServices = {
    createRentalOrderInDB,
    getCustomerOrdersFromDB,
    getProviderOrdersFromDB,
    updateOrderStatusInDB,
    returnGearFromOrderInDB
};