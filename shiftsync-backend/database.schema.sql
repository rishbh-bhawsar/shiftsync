-- ============================================================
-- ShiftSync — Database Schema (MySQL)
-- Healthcare Shift Scheduling Platform
-- ============================================================
-- Run this file after creating the database:
--   mysql -u root -p shiftsync < database.schema.sql
--
-- Tables are listed in dependency order (referenced tables
-- are created before the tables that reference them).
-- ============================================================

-- 1. users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              CHAR(36)        PRIMARY KEY,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  passwordHash    VARCHAR(255)    NOT NULL,
  name            VARCHAR(100)    NOT NULL,
  phone           VARCHAR(20),
  role            ENUM('admin','facility','worker') NOT NULL,
  profilePhoto    VARCHAR(500),
  oneSignalPlayerId VARCHAR(255),
  refreshToken    TEXT,
  isActive        BOOLEAN         DEFAULT TRUE,
  specializations JSON,
  licenseNumber   VARCHAR(100),
  rating          FLOAT           DEFAULT 0,
  totalShiftsCompleted INT        DEFAULT 0,
  locationLat     FLOAT,
  locationLng     FLOAT,
  locationCity    VARCHAR(100),
  facilityId      CHAR(36),
  createdAt       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. facilities
-- ============================================================
CREATE TABLE IF NOT EXISTS facilities (
  id            CHAR(36)        PRIMARY KEY,
  name          VARCHAR(200)    NOT NULL,
  address       VARCHAR(500)    NOT NULL,
  locationLat   FLOAT           NOT NULL,
  locationLng   FLOAT           NOT NULL,
  phone         VARCHAR(20),
  email         VARCHAR(255),
  type          ENUM('hospital','clinic','nursing_home') NOT NULL,
  managerId     CHAR(36)        NOT NULL,
  logo          VARCHAR(500),
  rating        FLOAT           DEFAULT 0,
  isVerified    BOOLEAN         DEFAULT FALSE,
  createdAt     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (managerId) REFERENCES users(id) ON DELETE CASCADE
);

-- Add foreign key from users → facilities (circular reference)
ALTER TABLE users
  ADD CONSTRAINT fk_users_facility
  FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE SET NULL;

-- 3. shifts
-- ============================================================
CREATE TABLE IF NOT EXISTS shifts (
  id                  CHAR(36)        PRIMARY KEY,
  facilityId          CHAR(36)        NOT NULL,
  facilityName        VARCHAR(200)    NOT NULL,
  facilityAddress     VARCHAR(500)    NOT NULL,
  facilityLocationLat FLOAT           NOT NULL,
  facilityLocationLng FLOAT           NOT NULL,
  title               VARCHAR(200)    NOT NULL,
  specialization      VARCHAR(100)    NOT NULL,
  date                DATE            NOT NULL,
  startTime           VARCHAR(5)      NOT NULL,   -- "HH:MM"
  endTime             VARCHAR(5)      NOT NULL,   -- "HH:MM"
  durationHours       FLOAT           NOT NULL,
  payRate             DECIMAL(10,2)   NOT NULL,
  totalPay            DECIMAL(10,2)   NOT NULL,
  requiredWorkers     INT             DEFAULT 1,
  claimedCount        INT             DEFAULT 0,
  status              ENUM('open','partially_filled','filled','cancelled','completed') DEFAULT 'open',
  description         TEXT,
  requirements        JSON,
  createdBy           CHAR(36)        NOT NULL,
  createdAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy)  REFERENCES users(id) ON DELETE CASCADE
);

-- 4. bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id              CHAR(36)        PRIMARY KEY,
  shiftId         CHAR(36)        NOT NULL,
  workerId        CHAR(36)        NOT NULL,
  facilityId      CHAR(36)        NOT NULL,
  status          ENUM('pending','confirmed','checked_in','checked_out','completed','cancelled','no_show') DEFAULT 'pending',
  checkInTime     TIMESTAMP,
  checkOutTime    TIMESTAMP,
  actualHours     FLOAT,
  totalEarned     DECIMAL(10,2),
  workerRating    FLOAT,
  facilityRating  FLOAT,
  createdAt       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shiftId)    REFERENCES shifts(id)   ON DELETE CASCADE,
  FOREIGN KEY (workerId)   REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

-- 5. timesheets
-- ============================================================
CREATE TABLE IF NOT EXISTS timesheets (
  id          CHAR(36)        PRIMARY KEY,
  workerId    CHAR(36)        NOT NULL,
  weekStart   DATE            NOT NULL,
  weekEnd     DATE            NOT NULL,
  bookingIds  JSON,
  totalHours  FLOAT           DEFAULT 0,
  totalEarned DECIMAL(10,2)   DEFAULT 0,
  status      ENUM('pending','approved','disputed') DEFAULT 'pending',
  createdAt   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (workerId) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id          CHAR(36)        PRIMARY KEY,
  userId      CHAR(36)        NOT NULL,
  title       VARCHAR(255)    NOT NULL,
  body        TEXT            NOT NULL,
  type        ENUM('new_shift','shift_claimed','shift_reminder','booking_update') NOT NULL,
  relatedId   CHAR(36),
  isRead      BOOLEAN         DEFAULT FALSE,
  createdAt   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id            CHAR(36)        PRIMARY KEY,
  bookingId     CHAR(36)        NOT NULL,
  reviewerId    CHAR(36)        NOT NULL,
  revieweeId    CHAR(36)        NOT NULL,
  revieweeType  ENUM('worker','facility') NOT NULL,
  rating        INT             NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  createdAt     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (bookingId)  REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewerId) REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (revieweeId) REFERENCES users(id)     ON DELETE CASCADE
);

-- ============================================================
-- INDEXES (composite indexes for common queries)
-- ============================================================

-- Shifts: filter by status + date
CREATE INDEX idx_shifts_status_date ON shifts(status, date);

-- Shifts: facility's shifts
CREATE INDEX idx_shifts_facility_status ON shifts(facilityId, status);

-- Bookings: worker's bookings (newest first)
CREATE INDEX idx_bookings_worker_created ON bookings(workerId, createdAt DESC);

-- Bookings: facility's bookings
CREATE INDEX idx_bookings_facility_status ON bookings(facilityId, status);

-- Timesheets: worker's timesheets
CREATE INDEX idx_timesheets_worker_week ON timesheets(workerId, weekStart DESC);

-- Notifications: user's unread notifications
CREATE INDEX idx_notifications_user_read ON notifications(userId, isRead);

-- Reviews: reviews for a reviewee
CREATE INDEX idx_reviews_reviewee ON reviews(revieweeId, revieweeType);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
