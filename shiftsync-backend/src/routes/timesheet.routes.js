import { Router } from 'express';
import {
  getWorkerTimesheets, getTimesheetById, generateWeeklyTimesheet,
  approveTimesheet, disputeTimesheet,
} from '../controllers/timesheet.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../constants/roles.constants.js';

const router = Router();

router.get('/worker/:id', authenticate, getWorkerTimesheets);
router.get('/:id', authenticate, getTimesheetById);
router.post('/generate/:workerId', authenticate, authorize([ROLES.ADMIN]), generateWeeklyTimesheet);
router.put('/:id/approve', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), approveTimesheet);
router.put('/:id/dispute', authenticate, authorize([ROLES.WORKER]), disputeTimesheet);

export default router;
