import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import { PaymentServices } from "./payment.service";

//* Initiate payment
const initiatePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { rentalOrderId } = req.body;
    const userId = req.user!.userId;

    const result = await PaymentServices.initiatePaymentInDB(rentalOrderId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Payment session created successfully',
        data: result
    })

})

//* Handle payment success
const paymentSuccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tranId = req.body?.tran_id || req.query?.tranId;

    await PaymentServices.handlePaymentSuccessInDB(tranId as string);

    // return a success message screen
    res.send(`
      <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
        <h1 style="color: green;">🎉 Payment Successful!</h1>
        <p>Your transaction ID: <strong>${tranId}</strong></p>
        <p>You can now close this tab and check your order status.</p>
      </div>
    `);

});

//* Handle payment fail
const paymentFail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tranId = req.body?.tran_id || req.query?.tranId;

    await PaymentServices.handlePaymentFailInDB(tranId);

    res.send(`
      <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
        <h1 style="color: red;">❌ Payment Failed!</h1>
        <p>Transaction ID: <strong>${tranId}</strong></p>
        <p>Please try again from your order dashboard.</p>
      </div>
    `);
})

export const PaymentControllers = {
    initiatePayment,
    paymentSuccess,
    paymentFail,
};