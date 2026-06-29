import cron from 'node-cron';
import { Booking, Shift, User } from '../models/index.js';
import { createAndEmitNotification } from '../controllers/notification.controller.js';
import { sendEmail, shiftReminderEmail } from '../utils/email.util.js';
import { Op } from 'sequelize';

const checkShiftReminders = async () => {
  try {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 30 * 60 * 1000);

    const today = now.toISOString().split('T')[0];
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const reminderTimeStr = `${String(reminderTime.getHours()).padStart(2, '0')}:${String(reminderTime.getMinutes()).padStart(2, '0')}`;

    const upcomingShifts = await Shift.findAll({
      where: {
        date: today,
        startTime: { [Op.gte]: currentTime, [Op.lte]: reminderTimeStr },
        status: { [Op.in]: ['filled', 'partially_filled'] },
      },
    });

    for (const shift of upcomingShifts) {
      const bookings = await Booking.findAll({
        where: { shiftId: shift.id, status: { [Op.in]: ['confirmed', 'checked_in'] } },
      });

      for (const booking of bookings) {
        const worker = await User.findByPk(booking.workerId);
        if (!worker) continue;

        const notificationKey = `reminder_${booking.id}_${today}`;
        if (global.__sentReminders?.has(notificationKey)) continue;

        createAndEmitNotification({
          userId: worker.id,
          title: '⏰ Shift Reminder',
          body: `Your shift "${shift.title}" starts in 30 minutes!`,
          type: 'shift_reminder',
          relatedId: shift.id,
        }).catch(() => {});

        if (worker.email) {
          sendEmail(shiftReminderEmail({
            workerName: worker.name,
            workerEmail: worker.email,
            shiftTitle: shift.title,
            shiftDate: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
            facilityName: shift.facilityName,
            facilityAddress: shift.facilityAddress,
          })).catch(() => {});
        }

        if (!global.__sentReminders) global.__sentReminders = new Set();
        global.__sentReminders.add(notificationKey);
      }
    }
  } catch (error) {
    console.error('Shift reminder check error:', error.message);
  }
};

export const startShiftReminders = () => {
  cron.schedule('* * * * *', checkShiftReminders);
  console.log('Shift reminder cron started (checks every minute)');
};
