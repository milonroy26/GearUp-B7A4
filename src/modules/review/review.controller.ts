import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { ReviewServices } from "./review.service";

//* Create review
const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user!.userId;

    const result = await ReviewServices.createReviewInDB(customerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Review created successfully',
        data: result
    })

})

//* get gear reviews
const getGearReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const gearId = req.params.gearId as string;

    const result = await ReviewServices.getGearReviewsFromDB(gearId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Gear reviews fetched successfully',
        data: result
    })

})


export const ReviewControllers = {
    createReview,
    getGearReviews
};