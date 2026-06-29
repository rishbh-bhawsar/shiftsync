import { Router } from 'express';
import {
  getPlatformAnalytics, getFacilityAnalytics, getWorkerAnalytics,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../constants/roles.constants.js';

const router = Router();

router.get('/platform', authenticate, authorize([ROLES.ADMIN]), getPlatformAnalytics);
router.get('/facility/:id', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), getFacilityAnalytics);
router.get('/worker/:id', authenticate, getWorkerAnalytics);

export default router;
