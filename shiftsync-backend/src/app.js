import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import corsOptions from './config/cors.config.js';
import logger from './middleware/logger.middleware.js';
import { rateLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import shiftRoutes from './routes/shift.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import timesheetRoutes from './routes/timesheet.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import reviewRoutes from './routes/review.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(logger);
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
