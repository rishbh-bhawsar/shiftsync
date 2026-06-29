import { Notification, User } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { getIO } from '../config/socket.config.js';
import { sendPushNotification } from '../utils/onesignal.util.js';

export const createAndEmitNotification = async ({ userId, title, body, type, relatedId }) => {
  const notification = await Notification.create({ userId, title, body, type, relatedId });

  try {
    const io = getIO();
    io.to(`user_${userId}`).emit('new_notification', notification);
  } catch {}

  try {
    const user = await User.findByPk(userId, { attributes: ['oneSignalPlayerId'] });
    if (user?.oneSignalPlayerId) {
      await sendPushNotification({
        playerIds: [user.oneSignalPlayerId],
        title,
        body,
        data: { notificationId: notification.id, type },
      });
    }
  } catch {}

  return notification;
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, notifications);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return sendError(res, 'Notification not found', 404);

    await notification.update({ isRead: true });
    return sendSuccess(res, notification);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    return sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return sendError(res, 'Notification not found', 404);

    await notification.destroy();
    return sendSuccess(res, null, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};

export const registerDevice = async (req, res, next) => {
  try {
    const { playerId } = req.body;

    await User.update(
      { oneSignalPlayerId: playerId },
      { where: { id: req.user.id } }
    );
    return sendSuccess(res, null, 'Device registered');
  } catch (err) {
    next(err);
  }
};

export const sendTestNotification = async (req, res, next) => {
  try {
    const notification = await createAndEmitNotification({
      userId: req.user.id,
      title: 'Test Notification',
      body: 'This is a test notification — notifications are working!',
      type: 'new_shift',
      relatedId: null,
    });
    return sendSuccess(res, notification, 'Test notification sent', 201);
  } catch (err) {
    next(err);
  }
};
