import { Facility, Shift } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getAllFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.findAll({ order: [['createdAt', 'DESC']] });
    return sendSuccess(res, facilities);
  } catch (err) {
    next(err);
  }
};

export const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    return sendSuccess(res, facility, 'Facility created', 201);
  } catch (err) {
    next(err);
  }
};

export const getFacilityById = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id);
    if (!facility) return sendError(res, 'Facility not found', 404);
    return sendSuccess(res, facility);
  } catch (err) {
    next(err);
  }
};

export const updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id);
    if (!facility) return sendError(res, 'Facility not found', 404);

    await facility.update(req.body);
    return sendSuccess(res, facility, 'Facility updated');
  } catch (err) {
    next(err);
  }
};

export const deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id);
    if (!facility) return sendError(res, 'Facility not found', 404);

    await facility.destroy();
    return sendSuccess(res, null, 'Facility deleted');
  } catch (err) {
    next(err);
  }
};

export const getFacilityShifts = async (req, res, next) => {
  try {
    const shifts = await Shift.findAll({
      where: { facilityId: req.params.id },
      order: [['date', 'ASC']],
    });
    return sendSuccess(res, shifts);
  } catch (err) {
    next(err);
  }
};

export const getFacilityAnalytics = async (req, res, next) => {
  try {
    const facilityId = req.params.id;
    const totalShifts = await Shift.count({ where: { facilityId } });
    const filledShifts = await Shift.count({ where: { facilityId, status: 'completed' } });
    const openShifts = await Shift.count({ where: { facilityId, status: 'open' } });

    return sendSuccess(res, {
      totalShifts,
      filledShifts,
      openShifts,
      fillRate: totalShifts ? ((filledShifts / totalShifts) * 100).toFixed(1) : 0,
    });
  } catch (err) {
    next(err);
  }
};
