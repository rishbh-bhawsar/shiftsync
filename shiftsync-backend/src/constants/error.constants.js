export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const TIMESHEET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DISPUTED: 'disputed',
};

export const NOTIFICATION_TYPE = {
  NEW_SHIFT: 'new_shift',
  SHIFT_CLAIMED: 'shift_claimed',
  SHIFT_REMINDER: 'shift_reminder',
  BOOKING_UPDATE: 'booking_update',
};

export const FACILITY_TYPE = {
  HOSPITAL: 'hospital',
  CLINIC: 'clinic',
  NURSING_HOME: 'nursing_home',
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'Email already registered',
  SHIFT_FULL: 'Shift is fully booked',
  SHIFT_NOT_OPEN: 'Shift is not open',
  ALREADY_CLAIMED: 'You have already claimed this shift',
  BOOKING_NOT_FOUND: 'Booking not found',
};
