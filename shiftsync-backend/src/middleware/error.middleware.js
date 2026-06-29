import { sendError } from '../utils/response.util.js';

export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message, err.stack);

  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(res, err.message || 'Internal server error', 500);
};
