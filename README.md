# Workout Log

A full-stack workout tracker built with React, Express, and Postgres. This application is built for workout enthusiasts who wish to track their progress. It also allows organization for individualized progress.

## User Stores

**Auth**

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Workouts**

- A logged-in user can see all of their workouts
- A logged-in user can create a new workout by creating a title
- A logged-in user can specific the workout type, date of workout, duration, notes, etc.
- A logged-in user can create groups of workouts bundled as sessions

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

workouts
─────────────────────────────
workout_id  SERIAL PRIMARY KEY
title       TEXT NOT NULL
description TEXT NOT NULL
date        TIMESTAMP NOT NULL
duration    INT NOT NULL
type        TEXT NOT NULL
notes       TEXT
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many workouts. Deleting a user cascades to delete all of their todos.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Workout endpoints (all require authentication)

| Method | Endpoint                    | Request Body | Response                                                                       |
| ------ | --------------------------- | ------------ | ------------------------------------------------------------------------------ |
| GET    | `/api/workouts`             | —            | `[{ workout_id, title, description, date, duration, type, notes, user_id }]`   |
| POST   | `/api/workouts`             | `{ title }`  | `{ workout_id   , title, description, date, duration, type, notes,  user_id }` |
| PATCH  | `/api/workouts/:workout_id` | `{}`         | `{ workout_id,  title, description, date, duration, type, notes, user_id }`    |
| DELETE | `/api/workouts/:workout_id` | —            | `{ workout_id, title, description, date, duration, type, notes, user_id }`     |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb workouts_db
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| reze     | password123 |
| denji    | password123 |

## Application Structure

```
workout-app/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── todo-adapters.js  # Fetch adapters for /api/todos/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── TodoPage.jsx    # Main app container (shown when logged in)
│   │       ├── AddTodoForm.jsx # Form to create a new todo
│   │       ├── TodoList.jsx    # Renders a list of TodoItems
│   │       └── TodoItem.jsx    # Single todo: checkbox, title, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── todoControllers.js  # list, create, update, delete todos
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── todoModel.js    # SQL queries for the todos table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
