import { prisma } from "../../lib/prisma";


//* create category
const createCategoryIntoDB = async (name: string) => {
    return await prisma.category.create(
        {
            data: { name }
        }
    );
};

//* Get all categories
const getAllCategories = async () => {
    return await prisma.category.findMany();
}


export const CategoryServices = {
    createCategoryIntoDB,
    getAllCategories
};