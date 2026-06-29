import http from 'http';
import dotenv from 'dotenv';
import app from './src/app.js';
import sequelize from './src/config/db.config.js';
import { initSocket } from './src/config/socket.config.js';
import { startShiftReminders } from './src/jobs/shiftReminder.job.js';
import './src/models/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startShiftReminders();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
