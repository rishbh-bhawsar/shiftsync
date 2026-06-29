import { Router } from 'express';
import {
  getAllUsers, getUserById, updateUser, deleteUser,
  uploadPhoto, getUserBookings, getNearbyWorkers,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateUserSchema } from '../validators/user.validator.js';
import { upload } from '../utils/upload.util.js';
import { ROLES } from '../constants/roles.constants.js';

const router = Router();

router.get('/', authenticate, authorize([ROLES.ADMIN]), getAllUsers);
router.get('/workers/nearby', authenticate, authorize([ROLES.FACILITY, ROLES.ADMIN]), getNearbyWorkers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, validate(updateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize([ROLES.ADMIN]), deleteUser);
router.put('/:id/photo', authenticate, upload.single('photo'), uploadPhoto);
router.get('/:id/bookings', authenticate, getUserBookings);

export default router;
