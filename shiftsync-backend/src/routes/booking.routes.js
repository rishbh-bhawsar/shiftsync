import { Router } from 'express';
import {
  getAllBookings, getBookingById, confirmBooking, rejectBooking, cancelBooking,
  checkIn, checkOut, getWorkerBookings, getFacilityBookings,
} from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../constants/roles.constants.js';

const router = Router();

router.get('/', authenticate, authorize([ROLES.ADMIN]), getAllBookings);
router.get('/worker/:id', authenticate, getWorkerBookings);
router.get('/facility/:id', authenticate, getFacilityBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/confirm', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), confirmBooking);
router.put('/:id/reject', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), rejectBooking);
router.put('/:id/cancel', authenticate, cancelBooking);
router.put('/:id/checkin', authenticate, authorize([ROLES.WORKER]), checkIn);
router.put('/:id/checkout', authenticate, authorize([ROLES.WORKER]), checkOut);

export default router;
