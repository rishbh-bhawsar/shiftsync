import { Review, User, Booking, Facility } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const submitReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return sendError(res, 'Booking not found', 404);
    if (booking.status !== 'completed' && booking.status !== 'checked_out') {
      return sendError(res, 'Can only review completed or checked out shifts', 400);
    }

    const existingReview = await Review.findOne({
      where: { bookingId, reviewerId: req.user.id },
    });
    if (existingReview) return sendError(res, 'You already reviewed this booking', 400);

    const isWorker = req.user.role === 'worker';
    let revieweeId;
    const revieweeType = isWorker ? 'facility' : 'worker';

    if (isWorker) {
      const facility = await Facility.findByPk(booking.facilityId);
      revieweeId = facility ? facility.managerId : booking.facilityId;
    } else {
      revieweeId = booking.workerId;
    }

    const review = await Review.create({
      bookingId,
      reviewerId: req.user.id,
      revieweeId,
      revieweeType,
      rating,
      comment,
    });

    const reviewee = await User.findByPk(revieweeId);
    if (reviewee) {
      const reviews = await Review.findAll({ where: { revieweeId } });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await reviewee.update({ rating: parseFloat(avgRating.toFixed(1)) });
    }

    return sendSuccess(res, review, 'Review submitted', 201);
  } catch (err) {
    next(err);
  }
};

export const getWorkerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { revieweeId: req.params.id, revieweeType: 'worker' },
      include: ['reviewer'],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, reviews);
  } catch (err) {
    next(err);
  }
};

export const getFacilityReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { revieweeId: req.params.id, revieweeType: 'facility' },
      include: ['reviewer'],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, reviews);
  } catch (err) {
    next(err);
  }
};
