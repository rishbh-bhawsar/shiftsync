import { User } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { uploadToCloudinary } from '../utils/upload.util.js';
import { Op } from 'sequelize';
import { getDistanceKm } from '../utils/geocode.util.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash', 'refreshToken'] },
    });
    return sendSuccess(res, users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash', 'refreshToken'] },
    });
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return sendError(res, 'Access denied', 403);
    }

    const allowed = ['name', 'phone', 'specializations', 'licenseNumber'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    await user.update(updates);
    return sendSuccess(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    await user.update({ isActive: false });
    return sendSuccess(res, null, 'User deactivated');
  } catch (err) {
    next(err);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    if (!req.file) return sendError(res, 'No file uploaded', 400);

    const photoUrl = await uploadToCloudinary(req.file);
    await user.update({ profilePhoto: photoUrl });
    return sendSuccess(res, { profilePhoto: photoUrl }, 'Photo uploaded');
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    const { Booking } = await import('../models/index.js');
    const bookings = await Booking.findAll({
      where: { workerId: req.params.id },
      include: ['shift'],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};

export const getNearbyWorkers = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return sendError(res, 'lat and lng are required', 400);

    const workers = await User.findAll({
      where: { role: 'worker', isActive: true },
      attributes: { exclude: ['passwordHash', 'refreshToken'] },
    });

    const nearby = workers
      .filter((w) => w.locationLat && w.locationLng)
      .map((w) => {
        const distance = getDistanceKm(parseFloat(lat), parseFloat(lng), w.locationLat, w.locationLng);
        return { ...w.toJSON(), distanceKm: parseFloat(distance.toFixed(1)) };
      })
      .filter((w) => w.distanceKm <= 20)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return sendSuccess(res, nearby);
  } catch (err) {
    next(err);
  }
};
