# Gym Tracker

A full-stack workout tracker for logging training sessions set by set and looking back at previous performance. It has an Express + TypeScript REST API backed by Neon serverless Postgres, plus a separate frontend, both deployed on Vercel.

**Live demo:** https://gym-tracker-sigma-taupe.vercel.app

## Features

- Organise exercises into **categories** (e.g. push, pull, legs) and add your own
- Start a **workout**, log **sets** against it as you train, then end it
- Edit a logged set, or delete a whole workout
- View the **history of previous sets for any exercise**, so you know what to beat next session
- User creation
- Database migration, seed and reset scripts, plus an import tool for moving data from an earlier SQLite version of the app

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (ES modules) |
| API | Express 5, CORS, `dotenv` |
| Database | Neon serverless Postgres (`@neondatabase/serverless`) |
| Frontend | Vue in `frontend/` |
| Dev tooling | `tsx` (run TypeScript directly), ngrok (public tunnel to the local API) |
| Hosting | Vercel (the Express app is exported for serverless deployment) |

## Project Structure

```
.
├── src/
│   ├── index.ts         App setup, CORS, route mounting, local server + ngrok tunnel
│   ├── router/          One router per resource (categories, exercises, sets, workouts, users)
│   ├── controllers/     Request handlers
│   └── scripts/         migrate, seed, resetDb, importFromSqlite
├── frontend/            Web client
├── vercel.json          Vercel configuration
└── package.json
```

## Getting Started

**Prerequisites:** Node.js 20 or newer, npm, and a free [Neon](https://neon.tech) Postgres database.

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in the project root (see Environment Variables below)

# 3. Create the database schema
npm run migrate

# 4. (Optional) Load sample data
npm run seed

# 5. Start the API in watch mode
npm run dev
```

The API starts on `http://localhost:3030` by default. Check it with:

```bash
curl http://localhost:3030/api/status
```

Then start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string
| `PORT` | No | API port. Defaults to `3030` |
| `FRONTEND_ORIGINS` | No | Comma-separated list of allowed frontend origins for CORS. `http://localhost:5173` and `http://localhost:3000` are always allowed once this is set. If unset, all origins are allowed |
| `NGROK_AUTHTOKEN` | No | Enables the ngrok tunnel in local development, which is useful for testing the frontend or a phone against your local API. If missing, the API still starts without the tunnel |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Runs the API with `tsx` in watch mode |
| `npm run migrate` | Applies the database schema |
| `npm run seed` | Inserts sample data |
| `npm run dbReset` | Resets the database. **Destructive**: do not run against data you want to keep |
| `npm run dbImport` | Imports data from an existing SQLite database file |

## API Reference

All routes are prefixed with `/api`. Request and response bodies are JSON.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/status` | Health check |
| `GET` | `/categories` | List all exercise categories |
| `POST` | `/categories` | Create a category |
| `GET` | `/exercises/onCategory/:categoryId` | List exercises in a category |
| `POST` | `/exercises/new/:categoryId` | Create an exercise in a category |
| `POST` | `/workouts` | Start a new workout |
| `POST` | `/workouts/:id/sets` | Log a set in a workout |
| `PATCH` | `/workouts/end/:id` | End a workout |
| `DELETE` | `/workouts/delete/:id` | Delete a workout |
| `PATCH` | `/sets/:id` | Update a logged set |
| `GET` | `/sets/history/exercise/:exerciseId` | Previous sets for an exercise |
| `POST` | `/users/new` | Create a user |


## Deployment

The app is deployed on Vercel (see `vercel.json`). Set the environment variables above in the Vercel project settings. The ngrok tunnel only starts outside production and outside Vercel, so it never runs in the deployed app.
