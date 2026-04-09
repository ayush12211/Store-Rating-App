# StoreRate — Full Stack Store Rating Platform

A full-stack web application allowing users to submit ratings (1–5) for registered stores, with role-based access for Admins, Normal Users, and Store Owners.

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Backend   | Node.js + Express.js               |
| Database  | PostgreSQL + Sequelize ORM         |
| Frontend  | React.js (CRA)                     |
| Auth      | JWT (JSON Web Tokens) + bcryptjs   |

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize DB connection
│   ├── middleware/
│   │   └── auth.js              # JWT authenticate + authorize
│   ├── models/
│   │   ├── index.js             # Associations
│   │   ├── User.js
│   │   ├── Store.js
│   │   └── Rating.js
│   ├── routes/
│   │   ├── auth.js              # /api/auth/*
│   │   ├── admin.js             # /api/admin/*
│   │   ├── stores.js            # /api/stores/*
│   │   └── owner.js             # /api/owner/*
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js         # Axios API service layer
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── index.js     # Button, Input, Table, Modal, Toast, etc.
│   │   │       ├── Layout.js    # Sidebar + main layout
│   │   │       └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js   # Global auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── SettingsPage.js  # Change password (User + Owner)
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminUsers.js
│   │   │   │   └── AdminStores.js
│   │   │   ├── user/
│   │   │   │   └── UserStores.js
│   │   │   └── owner/
│   │   │       └── OwnerDashboard.js
│   │   ├── utils/
│   │   │   └── validators.js    # Client-side form validation
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Docker — Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed

### Steps

```bash
# 1. Clone / download the project
cd store-rating-app

# 2. Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build

# 3. Open your browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api/health
```

A default admin account is auto-created on first run:
- **Email:** `admin@storerating.com`
- **Password:** `Admin@123`

---

## Manual Setup (without Docker)

### Prerequisites
- Node.js v18+
- PostgreSQL 14+ running locally

### 1. Database Setup

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your DB credentials and JWT secret

# Install dependencies
npm install

# Start server (auto-syncs DB schema and seeds admin user)
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

> The frontend proxies `/api/*` requests to `http://localhost:5000` via the `"proxy"` field in `package.json`.

---

## Environment Variables (backend/.env)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path            | Auth     | Description             |
|--------|-----------------|----------|-------------------------|
| POST   | `/signup`       | Public   | Register normal user    |
| POST   | `/login`        | Public   | Login (all roles)       |
| PUT    | `/password`     | Any user | Change own password     |
| GET    | `/me`           | Any user | Get current user info   |

### Admin — `/api/admin`
| Method | Path            | Description                    |
|--------|-----------------|--------------------------------|
| GET    | `/dashboard`    | Stats: users, stores, ratings  |
| GET    | `/users`        | List users (with filters/sort) |
| GET    | `/users/:id`    | User detail (+ store rating)   |
| POST   | `/users`        | Create user (any role)         |
| GET    | `/stores`       | List stores (with filters/sort)|
| POST   | `/stores`       | Create store                   |

### Stores — `/api/stores`
| Method | Path                  | Auth  | Description                    |
|--------|-----------------------|-------|--------------------------------|
| GET    | `/`                   | Any   | All stores with user's rating  |
| POST   | `/:id/ratings`        | User  | Submit rating                  |
| PUT    | `/:id/ratings`        | User  | Modify existing rating         |

### Owner — `/api/owner`
| Method | Path         | Auth        | Description                       |
|--------|--------------|-------------|-----------------------------------|
| GET    | `/dashboard` | store_owner | Store info + who rated + avg      |

---

## User Roles & Features

### 🔴 System Administrator
- Dashboard with total users / stores / ratings
- Add users (admin, normal, store owner) and stores
- View & filter all users and stores by Name, Email, Address, Role
- View user detail including store owner's rating

### 🔵 Normal User
- Self-registration and login
- Browse all stores, search by name/address
- Submit ratings (1–5 stars)
- Modify previously submitted ratings
- Change password

### 🟢 Store Owner
- Login (account created by admin)
- Dashboard: see average rating + list of users who rated
- Rating distribution chart
- Change password

---

## Form Validation Rules

| Field    | Rule                                                      |
|----------|-----------------------------------------------------------|
| Name     | Min 20 chars, Max 60 chars                                |
| Address  | Max 400 chars                                             |
| Password | 8–16 chars, ≥1 uppercase letter, ≥1 special character    |
| Email    | Standard email format                                     |

Validation is enforced on **both** client-side (React) and server-side (express-validator).

---

## Database Schema

```
users
  id, name, email, password (hashed), address, role (admin|user|store_owner),
  createdAt, updatedAt

stores
  id, name, email, address, ownerId (FK → users.id),
  createdAt, updatedAt

ratings
  id, userId (FK → users.id), storeId (FK → stores.id),
  rating (1–5), createdAt, updatedAt
  UNIQUE(userId, storeId)
```

---

## Design Decisions & Best Practices

- **Passwords** are hashed with bcryptjs (salt rounds: 12) via Sequelize model hooks
- **JWT tokens** expire in 7 days; stored in localStorage on client
- **Role-based access** enforced at both route middleware (backend) and ProtectedRoute (frontend)
- **Sequelize `alter: true`** auto-syncs schema on startup without data loss
- **Unique constraint** on `(userId, storeId)` prevents duplicate ratings
- **Soft validation** on all listing queries — all filters are optional, invalid sort fields are sanitized
- Tables support **ascending/descending sort** on all key fields
- **CORS** enabled for development; tighten origins in production
