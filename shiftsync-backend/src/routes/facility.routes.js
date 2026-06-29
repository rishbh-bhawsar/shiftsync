import { Router } from 'express';
import {
  getAllFacilities, createFacility, getFacilityById,
  updateFacility, deleteFacility, getFacilityShifts, getFacilityAnalytics,
} from '../controllers/facility.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createFacilitySchema, updateFacilitySchema } from '../validators/facility.validator.js';
import { ROLES } from '../constants/roles.constants.js';

const router = Router();

router.get('/', authenticate, authorize([ROLES.ADMIN]), getAllFacilities);
router.post('/', authenticate, authorize([ROLES.ADMIN]), validate(createFacilitySchema), createFacility);
router.get('/:id', authenticate, getFacilityById);
router.put('/:id', authenticate, validate(updateFacilitySchema), updateFacility);
router.delete('/:id', authenticate, authorize([ROLES.ADMIN]), deleteFacility);
router.get('/:id/shifts', authenticate, getFacilityShifts);
router.get('/:id/analytics', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), getFacilityAnalytics);

export default router;
