import { verifyAccessToken } from '../utils/jwt.util.js';
import { sendError } from '../utils/response.util.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return sendError(res, 'No token provided', 401);

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return sendError(res, 'Invalid or expired token', 401);
  }
};
