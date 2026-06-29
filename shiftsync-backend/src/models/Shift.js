import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Shift = sequelize.define('Shift', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  facilityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'facilities',
      key: 'id',
    },
  },
  facilityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  facilityAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  facilityLocationLat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  facilityLocationLng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationHours: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  requiredWorkers: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  claimedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('open', 'partially_filled', 'filled', 'cancelled', 'completed'),
    defaultValue: 'open',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'shifts',
  timestamps: true,
});

export default Shift;
