# ShiftSync

A full-stack healthcare shift scheduling platform that connects healthcare facilities with workers. Facilities post shifts, workers find and claim them, and the platform handles check-in/check-out, timesheets, payments tracking, reviews, and real-time notifications.

## Tech Stack

### Backend

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** MySQL 8.0 with Sequelize ORM
- **Auth:** JWT (access + refresh tokens)
- **Real-time:** Socket.IO
- **Validation:** Joi
- **Push Notifications:** OneSignal
- **Email:** Nodemailer (SMTP)
- **File Uploads:** Multer + Cloudinary
- **Maps:** Google Maps API

### Frontend

- **Framework:** React 18 with Vite
- **State Management:** Redux Toolkit + RTK Query
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Charts:** Recharts
- **Calendar:** FullCalendar
- **Forms:** React Hook Form + Zod

## Roles

| Role | Description |
|------|-------------|
| `admin` | Platform administrator with full access |
| `facility` | Facility manager who creates shifts and manages workers |
| `worker` | Healthcare worker who finds and claims shifts |

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0
- Docker & Docker Compose (optional)

### Environment Setup

```bash
# Backend
cd shiftsync-backend
cp .env.example .env
# Edit .env with your credentials

# Frontend
cd shiftsync-frontend
cp .env.example .env
# Edit .env with your API URL
```

### Running with Docker

```bash
docker-compose up -d
```

This starts MySQL and the backend. The frontend runs separately.

### Running Locally

```bash
# Backend
cd shiftsync-backend
npm install
npm run db:sync   # Initialize database tables
npm run dev       # Start with nodemon

# Frontend
cd shiftsync-frontend
npm install
npm run dev       # Start Vite dev server
```

## Project Structure

```
shiftsync/
├── shiftsync-backend/
│   ├── src/
│   │   ├── config/          # DB, CORS, Cloudinary, email, Socket.IO config
│   │   ├── constants/       # Roles, error messages, shift statuses
│   │   ├── controllers/     # Route handlers
│   │   ├── jobs/            # Cron jobs (shift reminders)
│   │   ├── middleware/       # Auth, RBAC, validation, error handling
│   │   ├── models/          # Sequelize models (7 tables)
│   │   └── routes/          # API route definitions
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── server.js
├── shiftsync-frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # App layout with sidebar
│   │   ├── pages/           # Route pages by role (admin/facility/worker)
│   │   ├── router/          # React Router config
│   │   ├── socket/          # Socket.IO client
│   │   └── store/           # Redux store, slices, RTK Query APIs
│   └── vite.config.js
└── .gitignore
```

## Database Schema

7 tables: `users`, `facilities`, `shifts`, `bookings`, `timesheets`, `notifications`, `reviews`

### Key Relationships

- A **Facility** has many **Shifts** and is managed by a **User** (facility role)
- A **Worker** (user) can claim **Shifts** via **Bookings**
- **Bookings** track the full lifecycle: pending → confirmed → checked_in → checked_out → completed
- **Timesheets** aggregate completed bookings per week
- **Reviews** are bidirectional (worker ↔ facility) tied to completed bookings


## Key Features

- **JWT Authentication** with access/refresh token rotation
- **Role-Based Access Control** enforced via middleware on every route
- **Geolocation Search** for nearby shifts and workers
- **Real-time Updates** via Socket.IO (shift feed, facility updates)
- **Shift Lifecycle** — create, claim, unclaim, fill, cancel, complete
- **Booking State Machine** — pending → confirmed → checked_in → checked_out → completed
- **Automated Timesheet Generation** from completed bookings
- **Shift Reminders** — cron job sends push + email notifications 30 min before shift
- **Bidirectional Reviews** — workers rate facilities and vice versa
- **Push Notifications** via OneSignal
- **File Uploads** to Cloudinary
- **Security** — Helmet, CORS, rate limiting, input validation

## License
MIT

<img width="1854" height="924" alt="image" src="https://github.com/user-attachments/assets/e5553198-e221-4151-bf62-502cc44a6624" />
<img width="1854" height="927" alt="image" src="https://github.com/user-attachments/assets/0eeb65ee-320c-4538-b081-d357ef0d3b9c" />


