# StoreRate

StoreRate is a full-stack store rating platform built for the FullStack Intern Coding Challenge. It supports three roles with a single login system:

- `System Administrator`
- `Normal User`
- `Store Owner`

Users can browse stores, submit ratings from `1` to `5`, and access role-specific dashboards after logging in.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Sequelize |
| Authentication | JWT + bcryptjs |
| Deployment | Vercel + Render + Neon |

## Live Access

Add your deployed URLs here before submission:

- Frontend: `https://your-frontend-url`
- Backend Health Check: `https://your-backend-url/api/health`

## Recruiter Test Credentials

Use the following admin credentials to test the application after deployment:

- Admin Email: `admin@storerating.com`
- Admin Password: `Admin@123`

This admin account is auto-created by the backend on first run if no admin user exists in the database.

## Implemented Functionality

### System Administrator

- Log in through the common login page
- View dashboard statistics:
  total users, total stores, total submitted ratings
- Add new users with role selection:
  `admin`, `user`, `store_owner`
- Add new stores
- View all users with filters and sorting
- Filter users by `Name`, `Email`, `Address`, and `Role`
- View user details
- View all stores with filters and sorting
- Log out

### Normal User

- Sign up through the registration page
- Log in through the common login page
- Update password after login
- View all registered stores
- Search stores by `Name` and `Address`
- See store name, address, overall rating, and own submitted rating
- Submit a rating from `1` to `5`
- Modify a previously submitted rating
- Log out

### Store Owner

- Log in through the common login page
- Update password after login
- View store dashboard
- See average store rating
- See the list of users who submitted ratings
- See rating distribution
- Log out

## Form Validation Rules

The application follows the challenge validation requirements:

- Name: `20` to `60` characters
- Address: maximum `400` characters
- Password: `8` to `16` characters, at least one uppercase letter, at least one special character
- Email: standard email validation

Validation is enforced on both frontend and backend.

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `PUT /api/auth/password`
- `GET /api/auth/me`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `POST /api/admin/users`
- `GET /api/admin/stores`
- `POST /api/admin/stores`

### Stores

- `GET /api/stores`
- `POST /api/stores/:id/ratings`
- `PUT /api/stores/:id/ratings`

### Store Owner

- `GET /api/owner/dashboard`

## Local Setup

### Backend

1. Go to the backend folder.
2. Copy the example environment file.
3. Install dependencies.
4. Start the server.

```bash
cd backend
cp .env.example .env
npm install
npm start
```

### Frontend

1. Go to the frontend folder.
2. Install dependencies.
3. Start the Vite dev server.

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

For Render + Neon deployment, using `DATABASE_URL` is the simplest option.

```env
PORT=5000
DATABASE_URL=
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_SSL=true
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

### Frontend

```env
VITE_API_URL=https://your-render-backend-url/api
```

## Deployment

This project is prepared for:

- `Neon` for PostgreSQL
- `Render` for the backend
- `Vercel` for the frontend

### Backend Deployment on Render

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend Deployment on Vercel

- Framework: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Database Design

### users

- `id`
- `name`
- `email`
- `password`
- `address`
- `role`
- `createdAt`
- `updatedAt`

### stores

- `id`
- `name`
- `email`
- `address`
- `ownerId`
- `createdAt`
- `updatedAt`

### ratings

- `id`
- `userId`
- `storeId`
- `rating`
- `createdAt`
- `updatedAt`

Constraint:

- One user can rate one store only once

## Notes

- Passwords are hashed before storing in the database
- JWT-based authentication is used for protected routes
- Role-based access is enforced in both backend and frontend
- Sorting is supported in listing views for key fields
- The backend seeds the default admin account automatically if it does not exist
