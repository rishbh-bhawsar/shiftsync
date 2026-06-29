import { sendError } from '../utils/response.util.js';

export const authorize = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return sendError(res, 'Access denied', 403);
  }
  next();
};
