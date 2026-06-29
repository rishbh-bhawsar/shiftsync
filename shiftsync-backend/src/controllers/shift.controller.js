import { Shift, Booking, User, Facility } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { getDistanceKm } from '../utils/geocode.util.js';
import { calculateDurationHours } from '../utils/date.util.js';
import { getIO } from '../config/socket.config.js';
import { Op } from 'sequelize';

export const getAllShifts = async (req, res, next) => {
  try {
    const { status, specialization, date, facilityId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (specialization) where.specialization = specialization;
    if (date) where.date = date;
    if (facilityId) where.facilityId = facilityId;

    const shifts = await Shift.findAll({ where, order: [['date', 'ASC']] });
    return sendSuccess(res, shifts);
  } catch (err) {
    next(err);
  }
};

export const getShiftById = async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return sendError(res, 'Shift not found', 404);
    return sendSuccess(res, shift);
  } catch (err) {
    next(err);
  }
};

export const createShift = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.body.facilityId);
    if (!facility) return sendError(res, 'Facility not found', 404);

    const durationHours = calculateDurationHours(req.body.startTime, req.body.endTime);
    const totalPay = durationHours * req.body.payRate;

    const shift = await Shift.create({
      ...req.body,
      facilityName: facility.name,
      facilityAddress: facility.address,
      facilityLocationLat: facility.locationLat,
      facilityLocationLng: facility.locationLng,
      durationHours,
      totalPay,
      createdBy: req.user.id,
    });

    try {
      const io = getIO();
      io.to('shifts').emit('shift_posted', { shift });
    } catch {}

    return sendSuccess(res, shift, 'Shift created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateShift = async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return sendError(res, 'Shift not found', 404);

    const updates = { ...req.body };
    if (updates.startTime && updates.endTime) {
      updates.durationHours = calculateDurationHours(updates.startTime, updates.endTime);
      updates.totalPay = updates.durationHours * (updates.payRate || shift.payRate);
    }

    await shift.update(updates);
    await shift.reload();

    try {
      const io = getIO();
      io.to('shifts').emit('shift_updated', { shiftId: shift.id, ...updates });
    } catch {}

    return sendSuccess(res, shift, 'Shift updated');
  } catch (err) {
    next(err);
  }
};

export const deleteShift = async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return sendError(res, 'Shift not found', 404);

    await shift.update({ status: 'cancelled' });

    try {
      const io = getIO();
      io.to('shifts').emit('shift_cancelled', { shiftId: shift.id });
    } catch {}

    return sendSuccess(res, null, 'Shift cancelled');
  } catch (err) {
    next(err);
  }
};

export const getNearbyShifts = async (req, res, next) => {
  try {
    const { lat, lng, radius = 20 } = req.query;
    if (!lat || !lng) return sendError(res, 'lat and lng are required', 400);

    const shifts = await Shift.findAll({
      where: { status: { [Op.in]: ['open', 'partially_filled'] } },
    });

    const nearby = shifts
      .map((shift) => {
        const distance = getDistanceKm(
          parseFloat(lat), parseFloat(lng),
          shift.facilityLocationLat, shift.facilityLocationLng
        );
        return { ...shift.toJSON(), distanceKm: parseFloat(distance.toFixed(1)) };
      })
      .filter((s) => s.distanceKm <= parseFloat(radius))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return sendSuccess(res, nearby);
  } catch (err) {
    next(err);
  }
};

export const getOpenShifts = async (req, res, next) => {
  try {
    const shifts = await Shift.findAll({
      where: { status: { [Op.in]: ['open', 'partially_filled'] } },
      order: [['date', 'ASC']],
    });
    return sendSuccess(res, shifts);
  } catch (err) {
    next(err);
  }
};

export const claimShift = async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return sendError(res, 'Shift not found', 404);
    if (shift.status === 'cancelled' || shift.status === 'completed') {
      return sendError(res, 'Shift is not available', 400);
    }

    const existingBooking = await Booking.findOne({
      where: { shiftId: shift.id, workerId: req.user.id, status: { [Op.ne]: 'cancelled' } },
    });
    if (existingBooking) return sendError(res, 'You have already claimed this shift', 400);

    if (shift.claimedCount >= shift.requiredWorkers) {
      return sendError(res, 'Shift is fully booked', 400);
    }

    const booking = await Booking.create({
      shiftId: shift.id,
      workerId: req.user.id,
      facilityId: shift.facilityId,
    });

    const newClaimedCount = shift.claimedCount + 1;
    const newStatus = newClaimedCount >= shift.requiredWorkers ? 'filled' : 'partially_filled';
    await shift.update({ claimedCount: newClaimedCount, status: newStatus });

    const worker = await User.findByPk(req.user.id);

    try {
      const io = getIO();
      io.to('shifts').emit('shift_updated', {
        shiftId: shift.id,
        claimedCount: newClaimedCount,
        status: newStatus,
      });
      io.to(`facility_${shift.facilityId}`).emit('booking_received', {
        booking,
        worker: { name: worker.name },
      });
    } catch {}

    return sendSuccess(res, booking, 'Shift claimed', 201);
  } catch (err) {
    next(err);
  }
};

export const unclaimShift = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { shiftId: req.params.id, workerId: req.user.id, status: { [Op.ne]: 'cancelled' } },
    });
    if (!booking) return sendError(res, 'Booking not found', 404);

    await booking.update({ status: 'cancelled' });

    const shift = await Shift.findByPk(req.params.id);
    const newClaimedCount = Math.max(0, shift.claimedCount - 1);
    const newStatus = newClaimedCount === 0 ? 'open' : 'partially_filled';
    await shift.update({ claimedCount: newClaimedCount, status: newStatus });

    try {
      const io = getIO();
      io.to('shifts').emit('shift_updated', {
        shiftId: shift.id,
        claimedCount: newClaimedCount,
        status: newStatus,
      });
    } catch {}

    return sendSuccess(res, null, 'Shift unclaimed');
  } catch (err) {
    next(err);
  }
};

export const completeShift = async (req, res, next) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return sendError(res, 'Shift not found', 404);

    await shift.update({ status: 'completed' });

    try {
      const io = getIO();
      io.to('shifts').emit('shift_filled', { shiftId: shift.id });
    } catch {}

    return sendSuccess(res, shift, 'Shift completed');
  } catch (err) {
    next(err);
  }
};
