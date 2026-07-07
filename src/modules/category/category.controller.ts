import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { AppError } from "../../interfaces/customError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { CategoryServices } from "./category.service";

//* create category
const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    //* check if user admin
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isAdmin) {
        throw new AppError(httpStatus.FORBIDDEN, ('You do not have permission to access this resource.'));
    }

    const result = await CategoryServices.createCategoryIntoDB(req.body.name);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Category created successfully',
        data: result
    })
})

//* Get all categories
const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    //* check if user admin
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isAdmin) {
        throw new AppError(httpStatus.FORBIDDEN, ('You do not have permission to access this resource.'));
    }

    const result = await CategoryServices.getAllCategories();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Categories fetched successfully',
        data: result
    })
})


export const CategoryControllers = {
    createCategory,
    getAllCategories
};