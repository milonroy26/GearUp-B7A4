import { Router } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { ReviewControllers } from './review.controller';

const router = Router();

router.post('/', auth(UserRole.CUSTOMER), ReviewControllers.createReview);
router.get('/:gearId', ReviewControllers.getGearReviews);

export const ReviewRoutes = router;