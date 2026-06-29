import { Router } from 'express';
import {
  getNotifications, markAsRead, markAllAsRead,
  deleteNotification, registerDevice, sendTestNotification,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.put('/read-all', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);
router.post('/register-device', authenticate, registerDevice);
router.post('/test', authenticate, sendTestNotification);

export default router;
