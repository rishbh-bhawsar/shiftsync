import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Timesheet = sequelize.define('Timesheet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  workerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  weekStart: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  weekEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bookingIds: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  totalHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalEarned: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'disputed'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'timesheets',
  timestamps: true,
});

export default Timesheet;
