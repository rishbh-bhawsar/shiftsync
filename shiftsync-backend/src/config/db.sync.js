import sequelize from './db.config.js';
import '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
    await sequelize.sync({ alter: true });
    console.log('All models synced');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
};

syncDB();
