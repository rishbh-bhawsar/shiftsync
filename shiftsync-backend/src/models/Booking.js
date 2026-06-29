import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shiftId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'shifts',
      key: 'id',
    },
  },
  workerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  facilityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'facilities',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'pending',
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actualHours: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalEarned: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  workerRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  facilityRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
});

export default Booking;
