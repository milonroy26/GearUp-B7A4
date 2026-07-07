import httpStatus from 'http-status';
import { AppError } from "../../interfaces/customError";
import { prisma } from "../../lib/prisma";
import { TCreateGear, TUpdateGear } from './gear.validation';

//* create gear
const createGearIntoDB = async (providerId: string, payload: TCreateGear) => {

    //* provider is exist in database or not
    const provider = await prisma.user.findUnique({ where: { id: providerId } });

    if (!provider) {
        throw new AppError(httpStatus.NOT_FOUND, 'Provider not found');
    }

    const createdGear = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId
        }
    })

    return createdGear;

}

//* Get all Gear
const getAllGearFromDB = async (filters: any) => {

    const { category, brand, minPrice, maxPrice, search, sortOrder, sortBy } = filters;

    const whereConditions: any = {};

    if (category) {
        whereConditions.categoryId = category;
    }

    if (brand) {
        whereConditions.brand = brand;
    }

    if (minPrice || maxPrice) {
        whereConditions.pricePerDay = {};
        if (minPrice) whereConditions.pricePerDay.gte = Number(minPrice);
        if (maxPrice) whereConditions.pricePerDay.lte = Number(maxPrice);
    }

    if (search) {
        whereConditions.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const result = await prisma.gearItem.findMany({
        where: whereConditions,
        include: {
            category: true
        },
        orderBy: sortOrder && sortBy ? {
            [sortBy]: sortOrder
        } : {
            createdAt: "desc"
        },
    });

    return result;

}

//* Get gear by id 
const getGearByIdFromDB = async (id: string) => {

    const result = await prisma.gearItem.findUnique({
        where: {
            id
        },
        include: {
            category: true,
            provider: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

    return result;
}

//* Update gear
const updateGearInDB = async (gearId: string, providerId: string, payload: TUpdateGear) => {

    //* provider is exist in database or not
    const provider = await prisma.user.findUnique({ where: { id: providerId } });

    if (!provider) {
        throw new AppError(httpStatus.NOT_FOUND, 'Provider not found');
    }

    const result = await prisma.gearItem.update({
        where: {
            id: gearId, providerId
        },
        data: payload
    })

    return result;

}

//* Delete gear by id
const deleteGearFromDB = async (gearId: string, providerId: string) => {

    //* provider is exist in database or not
    const provider = await prisma.user.findUnique({ where: { id: providerId } });

    if (!provider) {
        throw new AppError(httpStatus.NOT_FOUND, 'Provider not found');
    }

    const result = await prisma.gearItem.delete({
        where: {
            id: gearId, providerId
        }
    })

    return result;

}

export const GearServices = {
    createGearIntoDB,
    getAllGearFromDB,
    getGearByIdFromDB,
    updateGearInDB,
    deleteGearFromDB
};