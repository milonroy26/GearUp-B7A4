import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { OrderStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { RentalServices } from "./rental.service";

//* Create rental order
const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user!.userId;

    const result = await RentalServices.createRentalOrderInDB(customerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Rental order created successfully',
        data: result
    })

})

//* Get Customer Orders
const getCustomerOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user!.userId;

    const result = await RentalServices.getCustomerOrdersFromDB(customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Customer orders fetched successfully',
        data: result
    })

})

//* Return Gear Order
const returnGearOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


//* Get Provider Orders
const getProviderOrders = catchAsync(async (req: Request, res: Response) => {

    const providerId = req.user!.userId;

    const result = await RentalServices.getProviderOrdersFromDB(providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Provider orders fetched successfully',
        data: result
    })

})


//* update Order Status
const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id as string;
    const status = req.body.status as OrderStatus;

    const result = await RentalServices.updateOrderStatusInDB(orderId, status);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Order status updated successfully',
        data: result
    })

})

export const RentalControllers = {
    createRentalOrder,
    getCustomerOrders,
    getProviderOrders,
    updateOrderStatus,
    returnGearOrder
};