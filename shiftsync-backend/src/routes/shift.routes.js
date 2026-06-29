import { Router } from 'express';
import {
  getAllShifts, getShiftById, createShift, updateShift, deleteShift,
  getNearbyShifts, getOpenShifts, claimShift, unclaimShift, completeShift,
} from '../controllers/shift.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createShiftSchema, updateShiftSchema } from '../validators/shift.validator.js';
import { ROLES } from '../constants/roles.constants.js';

const router = Router();

router.get('/', authenticate, getAllShifts);
router.get('/nearby', authenticate, authorize([ROLES.WORKER]), getNearbyShifts);
router.get('/open', authenticate, getOpenShifts);
router.get('/:id', authenticate, getShiftById);
router.post('/', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), validate(createShiftSchema), createShift);
router.put('/:id', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), validate(updateShiftSchema), updateShift);
router.delete('/:id', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), deleteShift);
router.post('/:id/claim', authenticate, authorize([ROLES.WORKER]), claimShift);
router.post('/:id/unclaim', authenticate, authorize([ROLES.WORKER]), unclaimShift);
router.put('/:id/complete', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), completeShift);

export default router;
