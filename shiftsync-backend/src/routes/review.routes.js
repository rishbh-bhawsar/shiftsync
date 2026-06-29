import { Router } from 'express';
import { submitReview, getWorkerReviews, getFacilityReviews } from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { reviewSchema } from '../validators/review.validator.js';

const router = Router();

router.post('/', authenticate, validate(reviewSchema), submitReview);
router.get('/worker/:id', authenticate, getWorkerReviews);
router.get('/facility/:id', authenticate, getFacilityReviews);

export default router;
