import { Timesheet, Booking } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { getMonday, addDays } from '../utils/date.util.js';

export const getWorkerTimesheets = async (req, res, next) => {
  try {
    const timesheets = await Timesheet.findAll({
      where: { workerId: req.params.id },
      order: [['weekStart', 'DESC']],
    });
    return sendSuccess(res, timesheets);
  } catch (err) {
    next(err);
  }
};

export const getTimesheetById = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findByPk(req.params.id);
    if (!timesheet) return sendError(res, 'Timesheet not found', 404);
    return sendSuccess(res, timesheet);
  } catch (err) {
    next(err);
  }
};

export const generateWeeklyTimesheet = async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const weekStart = getMonday(new Date());
    const weekEnd = addDays(weekStart, 6);

    const existing = await Timesheet.findOne({
      where: { workerId, weekStart: weekStart.toISOString().split('T')[0] },
    });
    if (existing) return sendError(res, 'Timesheet already exists for this week', 400);

    const bookings = await Booking.findAll({
      where: {
        workerId,
        status: 'checked_out',
        checkOutTime: { [Symbol.for('gte')]: weekStart },
      },
    });

    const bookingIds = bookings.map((b) => b.id);
    const totalHours = bookings.reduce((sum, b) => sum + (b.actualHours || 0), 0);
    const totalEarned = bookings.reduce((sum, b) => sum + parseFloat(b.totalEarned || 0), 0);

    const timesheet = await Timesheet.create({
      workerId,
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      bookingIds,
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalEarned: parseFloat(totalEarned.toFixed(2)),
    });

    return sendSuccess(res, timesheet, 'Timesheet generated', 201);
  } catch (err) {
    next(err);
  }
};

export const approveTimesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findByPk(req.params.id);
    if (!timesheet) return sendError(res, 'Timesheet not found', 404);

    await timesheet.update({ status: 'approved' });
    return sendSuccess(res, timesheet, 'Timesheet approved');
  } catch (err) {
    next(err);
  }
};

export const disputeTimesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findByPk(req.params.id);
    if (!timesheet) return sendError(res, 'Timesheet not found', 404);

    await timesheet.update({ status: 'disputed' });
    return sendSuccess(res, timesheet, 'Timesheet disputed');
  } catch (err) {
    next(err);
  }
};
