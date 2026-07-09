import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { AdminControllers } from "./admin.controller";

const router = Router();

router.get("/metrics", auth(UserRole.ADMIN), AdminControllers.getDashboardMetrics);

export const AdminRoutes = router;