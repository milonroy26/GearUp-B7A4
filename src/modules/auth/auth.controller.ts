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
    const payload = req.body
    const user = await AuthService.loginUserIntoDb(payload);

    const { accessToken } = user

    //* set cookie for access token
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 // 24 hour or 1 day
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: {
            accessToken
        }
    })

})


//* Profile
const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user!.userId

    if (!userId) {
        throw new Error('User not found')
    }

    const result = await AuthService.getMyProfileFromDB(userId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile fetched successfully',
        data: result
    })

})



export const AuthController = {
    registerUser,
    loginUser,
    getMyProfile
}