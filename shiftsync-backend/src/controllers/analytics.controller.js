import { Shift, Booking, User, Facility } from '../models/index.js';
import { sendSuccess } from '../utils/response.util.js';
import { Op } from 'sequelize';

export const getPlatformAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalShiftsThisMonth = await Shift.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });

    const totalShifts = await Shift.count();
    const filledShifts = await Shift.count({
      where: { status: { [Op.in]: ['completed', 'filled'] } },
    });
    const fillRate = totalShifts ? ((filledShifts / totalShifts) * 100).toFixed(1) : 0;

    const topFacilities = await Facility.findAll({
      attributes: ['id', 'name'],
      limit: 5,
    });

    const topWorkers = await User.findAll({
      where: { role: 'worker' },
      attributes: ['id', 'name', 'totalShiftsCompleted'],
      order: [['totalShiftsCompleted', 'DESC']],
      limit: 5,
    });

    return sendSuccess(res, {
      totalShiftsThisMonth,
      fillRate: parseFloat(fillRate),
      totalShifts,
      filledShifts,
      topFacilities,
      topWorkers,
    });
  } catch (err) {
    next(err);
  }
};

export const getFacilityAnalytics = async (req, res, next) => {
  try {
    const facilityId = req.params.id;

    const totalShifts = await Shift.count({ where: { facilityId } });
    const completedShifts = await Shift.count({ where: { facilityId, status: 'completed' } });
    const openShifts = await Shift.count({ where: { facilityId, status: 'open' } });
    const totalBookings = await Booking.count({ where: { facilityId } });

    return sendSuccess(res, {
      totalShifts,
      completedShifts,
      openShifts,
      totalBookings,
      fillRate: totalShifts ? ((completedShifts / totalShifts) * 100).toFixed(1) : 0,
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkerAnalytics = async (req, res, next) => {
  try {
    const workerId = req.params.id;

    const totalBookings = await Booking.count({ where: { workerId } });
    const completedBookings = await Booking.count({ where: { workerId, status: 'checked_out' } });
    const totalEarned = await Booking.sum('totalEarned', {
      where: { workerId, status: 'checked_out' },
    }) || 0;

    const worker = await User.findByPk(workerId, {
      attributes: ['id', 'name', 'rating', 'totalShiftsCompleted'],
    });

    return sendSuccess(res, {
      worker,
      totalBookings,
      completedBookings,
      totalEarned: parseFloat(totalEarned.toFixed(2)),
    });
  } catch (err) {
    next(err);
  }
};
