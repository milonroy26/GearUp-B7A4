import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { GearControllers } from "./gear.controller";
import { createGearSchema, updateGearSchema } from "./gear.validation";

const router = Router();

//  Public Routes
router.get('/', GearControllers.getAllGear);
router.get('/:id', GearControllers.getGearById);

// Provider Routes
router.post('/provider/gear', auth('PROVIDER'), validateRequest(createGearSchema), GearControllers.createGear);

router.put('/provider/gear/:id', auth('PROVIDER'), validateRequest(updateGearSchema), GearControllers.updateGear);

router.delete('/provider/gear/:id', auth('PROVIDER'), GearControllers.deleteGear);

export const GearRoutes = router;