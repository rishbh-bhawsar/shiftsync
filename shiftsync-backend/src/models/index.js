import User from './User.js';
import Facility from './Facility.js';
import Shift from './Shift.js';
import Booking from './Booking.js';
import Timesheet from './Timesheet.js';
import Notification from './Notification.js';
import Review from './Review.js';

User.belongsTo(Facility, { foreignKey: 'facilityId', as: 'facility' });
Facility.hasMany(User, { foreignKey: 'facilityId', as: 'workers' });

Facility.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });
User.hasOne(Facility, { foreignKey: 'managerId', as: 'managedFacility' });

Shift.belongsTo(Facility, { foreignKey: 'facilityId', as: 'facility' });
Facility.hasMany(Shift, { foreignKey: 'facilityId', as: 'shifts' });

Booking.belongsTo(Shift, { foreignKey: 'shiftId', as: 'shift' });
Shift.hasMany(Booking, { foreignKey: 'shiftId', as: 'bookings' });

Booking.belongsTo(User, { foreignKey: 'workerId', as: 'worker' });
User.hasMany(Booking, { foreignKey: 'workerId', as: 'bookings' });

Booking.belongsTo(Facility, { foreignKey: 'facilityId', as: 'facility' });
Facility.hasMany(Booking, { foreignKey: 'facilityId', as: 'bookings' });

Timesheet.belongsTo(User, { foreignKey: 'workerId', as: 'worker' });
User.hasMany(Timesheet, { foreignKey: 'workerId', as: 'timesheets' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Booking.hasOne(Review, { foreignKey: 'bookingId', as: 'review' });

Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

export { User, Facility, Shift, Booking, Timesheet, Notification, Review };
