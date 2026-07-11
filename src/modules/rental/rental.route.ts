import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { RentalControllers } from "./rental.controller";
import { createRentalOrderSchema } from "./rental.validation";

const router = Router();

//* Customer Endpoints
router.post('/', auth(UserRole.CUSTOMER), validateRequest(createRentalOrderSchema), RentalControllers.createRentalOrder);

router.get('/', auth(UserRole.CUSTOMER), RentalControllers.getCustomerOrders);

router.patch('/:id/return', auth(UserRole.CUSTOMER), RentalControllers.returnGearOrder);

//* Provider Endpoints
router.get('/provider/orders', auth(UserRole.PROVIDER), RentalControllers.getProviderOrders);

router.put('/provider/orders/:id', auth(UserRole.PROVIDER), RentalControllers.updateOrderStatus);

export const RentalRoutes = router;