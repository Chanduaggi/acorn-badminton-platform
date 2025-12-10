# Acorn Globus – Badminton Court Booking Platform

This is a full-stack reference implementation for the Acorn Globus internship assignment.

It includes:

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite) + Tailwind CSS
- **Features**: Multi-resource booking (court + equipment + optional coach) and dynamic pricing (weekend, peak hour, indoor premium).

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# update MONGO_URI if needed
npm run seed   # seed courts, equipment, coaches, pricing rules, admin user
npm run dev    # or npm start
```

API will run on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` and proxy `/api` to the backend.

## Notes

- Booking creation: `POST /api/bookings` with court, optional equipment, optional coach, startTime and endTime.
- Pricing is calculated dynamically based on DB-driven rules.
- Admin dashboard is a basic skeleton ready for CRUD extensions.
