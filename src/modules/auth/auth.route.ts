import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.registerUser);

router.post('/login', validateRequest(loginSchema), AuthController.loginUser);

router.get('/me', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), AuthController.getMyProfile);

export const authRoute = router;