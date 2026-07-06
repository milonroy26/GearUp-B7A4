import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

    let message = err.message || 'Something went wrong';

    let errorDetails = err.errorDetails || err.stack || null;

    //* Zod Error Handling
    if (err.name === 'ZodError') {
        statusCode = httpStatus.BAD_REQUEST;
        message = 'Validation Error';
        errorDetails = err.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }))
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails
    });

}