import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { GearServices } from "./gear.service";


//* create gear
const createGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user!.userId;

    const result = await GearServices.createGearIntoDB(providerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Gear created successfully',
        data: result
    })

})

//* Get all Gear
const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await GearServices.getAllGearFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Gear fetched successfully',
        data: result
    })

})

//* Get gear by id
const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await GearServices.getGearByIdFromDB(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Gear fetched successfully',
        data: result
    })
})

//* Update gear 
const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user!.userId;

    const result = await GearServices.updateGearInDB(req.params.id as string, providerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Gear updated successfully',
        data: result
    })

})

//* Delete gear
const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user!.userId;

    const result = await GearServices.deleteGearFromDB(req.params.id as string, providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Gear deleted successfully',
        data: result
    })

})



export const GearControllers = {
    createGear,
    getAllGear,
    getGearById,
    updateGear,
    deleteGear
}