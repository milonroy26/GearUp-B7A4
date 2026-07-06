import { prisma } from "../../lib/prisma";


const createCategoryIntoDB = async (name: string) => {
    return await prisma.category.create({ data: { name } });
};

export const CategoryServices = {
    createCategoryIntoDB,
};