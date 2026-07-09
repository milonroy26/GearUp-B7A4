import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { PaymentControllers } from "./payment.controller";

const router = Router();

// payment session initiate (protected)
router.post('/initiate', auth(UserRole.CUSTOMER), PaymentControllers.initiatePayment);

// SSLCommerz Callbacks (Public) - You will be redirected here from SSLCommerz
router.post('/success', PaymentControllers.paymentSuccess);
router.post('/fail', PaymentControllers.paymentFail);
router.post('/cancel', PaymentControllers.paymentFail); // Even though it's canceled, I'm treating it as a fail.

export const PaymentRoutes = router;