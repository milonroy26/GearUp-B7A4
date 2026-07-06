import { Router } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import { createCategorySchema } from './category.validation';


const router = Router();

router.post('/create', auth(UserRole.ADMIN), validateRequest(createCategorySchema), CategoryControllers.createCategory);

export const CategoryRoutes = router;