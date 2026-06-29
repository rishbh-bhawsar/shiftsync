import { Booking, Shift, User, Facility } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { createAndEmitNotification } from './notification.controller.js';
import { sendEmail, bookingConfirmedEmail, bookingCancelledEmail, bookingRejectedEmail } from '../utils/email.util.js';
import { Op } from 'sequelize';

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: ['shift', 'worker', 'facility'],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: ['shift', 'worker', 'facility'],
    });
    if (!booking) return sendError(res, 'Booking not found', 404);
    return sendSuccess(res, booking);
  } catch (err) {
    next(err);
  }
};

export const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: ['shift', 'worker', 'facility'] });
    if (!booking) return sendError(res, 'Booking not found', 404);

    await booking.update({ status: 'confirmed' });

    createAndEmitNotification({
      userId: booking.workerId,
      title: 'Booking Confirmed',
      body: `Your booking for ${booking.shift?.title} has been confirmed`,
      type: 'booking_update',
      relatedId: booking.id,
    }).catch(() => {});

    const worker = booking.worker;
    const shift = booking.shift;
    if (worker?.email && shift) {
      sendEmail(bookingConfirmedEmail({
        workerName: worker.name,
        workerEmail: worker.email,
        shiftTitle: shift.title,
        shiftDate: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        facilityName: booking.facility?.name || 'Facility',
      })).catch(() => {});
    }

    return sendSuccess(res, booking, 'Booking confirmed');
  } catch (err) {
    next(err);
  }
};

export const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: ['shift', 'worker', 'facility'] });
    if (!booking) return sendError(res, 'Booking not found', 404);

    await booking.update({ status: 'cancelled' });

    const shift = await Shift.findByPk(booking.shiftId);
    if (shift) {
      const newClaimedCount = Math.max(0, shift.claimedCount - 1);
      const newStatus = newClaimedCount === 0 ? 'open' : 'partially_filled';
      await shift.update({ claimedCount: newClaimedCount, status: newStatus });
    }

    createAndEmitNotification({
      userId: booking.workerId,
      title: 'Booking Rejected',
      body: `Your booking for ${booking.shift?.title} has been rejected`,
      type: 'booking_update',
      relatedId: booking.id,
    }).catch(() => {});

    const worker = booking.worker;
    const shiftData = booking.shift;
    if (worker?.email && shiftData) {
      sendEmail(bookingRejectedEmail({
        workerName: worker.name,
        workerEmail: worker.email,
        shiftTitle: shiftData.title,
        shiftDate: shiftData.date,
        facilityName: booking.facility?.name || 'Facility',
      })).catch(() => {});
    }

    return sendSuccess(res, null, 'Booking rejected');
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: ['shift', 'worker', 'facility'] });
    if (!booking) return sendError(res, 'Booking not found', 404);

    await booking.update({ status: 'cancelled' });

    const shift = await Shift.findByPk(booking.shiftId);
    if (shift) {
      const newClaimedCount = Math.max(0, shift.claimedCount - 1);
      const newStatus = newClaimedCount === 0 ? 'open' : 'partially_filled';
      await shift.update({ claimedCount: newClaimedCount, status: newStatus });
    }

    const cancelledBy = req.user.role === 'worker' ? 'you (worker)' : 'the facility';
    const recipientId = req.user.role === 'worker' ? shift?.createdBy : booking.workerId;

    if (recipientId) {
      const recipient = await User.findByPk(recipientId);
      createAndEmitNotification({
        userId: recipientId,
        title: 'Booking Cancelled',
        body: `Booking for ${booking.shift?.title} has been cancelled by ${cancelledBy}`,
        type: 'booking_update',
        relatedId: booking.id,
      }).catch(() => {});

      if (recipient?.email) {
        sendEmail(bookingCancelledEmail({
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          shiftTitle: booking.shift?.title || 'Shift',
          shiftDate: booking.shift?.date || 'N/A',
          facilityName: booking.facility?.name || 'Facility',
          cancelledBy,
        })).catch(() => {});
      }
    }

    return sendSuccess(res, null, 'Booking cancelled');
  } catch (err) {
    next(err);
  }
};

export const checkIn = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return sendError(res, 'Booking not found', 404);

    await booking.update({ status: 'checked_in', checkInTime: new Date() });
    return sendSuccess(res, booking, 'Checked in');
  } catch (err) {
    next(err);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return sendError(res, 'Booking not found', 404);

    const checkOutTime = new Date();
    const actualHours = Math.max(0.01, (checkOutTime - new Date(booking.checkInTime)) / (1000 * 60 * 60));
    const shift = await Shift.findByPk(booking.shiftId);
    const totalEarned = actualHours * (shift ? parseFloat(shift.payRate) : 0);

    await booking.update({
      status: 'checked_out',
      checkOutTime,
      actualHours: parseFloat(actualHours.toFixed(2)),
      totalEarned: parseFloat(totalEarned.toFixed(2)),
    });

    return sendSuccess(res, booking, 'Checked out');
  } catch (err) {
    next(err);
  }
};

export const getWorkerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { workerId: req.params.id },
      include: ['shift', 'facility'],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};

export const getFacilityBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { facilityId: req.params.id },
      include: ['shift', 'worker'],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};
