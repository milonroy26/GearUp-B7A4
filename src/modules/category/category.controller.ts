import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { CategoryServices } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await CategoryServices.createCategoryIntoDB(req.body.name);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Category created successfully',
        data: result
    })
})

export const CategoryControllers = {
    createCategory,
};