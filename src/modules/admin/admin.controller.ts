import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { AdminServices } from "./admin.service";

const getDashboardMetrics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await AdminServices.getDashboardMetricsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Dashboard metrics fetched successfully',
        data: result
    })

})

export const AdminControllers = {
    getDashboardMetrics
}