import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { AuthService } from "./auth.service";


//* Register User
const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await AuthService.registerUserIntoDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User registered successfully',
        data: result
    })

});

//* login user
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = await AuthService.loginUserIntoDb(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: {
            accessToken
        }
    })

})



export const AuthController = {
    registerUser,
    loginUser
}