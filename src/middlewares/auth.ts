import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { UserRole } from "../../generated/prisma/enums";
import config from "../config";
import { AppError } from "../interfaces/customError";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

interface JwtPayload {
    userId: string;
    role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
}

// Express Request ইন্টারফেস এক্সটেন্ড করা (userId এবং role যুক্ত করার জন্য)
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const auth = (...requiredRoles: UserRole[]) => {

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        //* check if token exist
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMjEwY2JkZS0wMmNlLTRkMDUtOTE3OS0wYWNkMDUzOGQwNmUiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3ODMzNzEzNzMsImV4cCI6MTc4MzQ1Nzc3M30.ClZpp84uXdUVWnF_D3l2JOw3ZvGeYrngYSBmaJ2tRAs";

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        //* verify token
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        const { role, userId } = verifiedToken.data as JwtPayload;

        //* check if user has required role
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this resource.');
        }

        //* Check if user exist
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                role
            }
        })

        if (!user || user.isDeleted) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        //* Attach the user to the request
        req.user = {
            userId: user.id,
            role: user.role,
        };

        next();

    })

}