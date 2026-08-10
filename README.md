# 🌾 AgriVeda AI 

AgriVeda AI is a comprehensive, AI-powered agricultural platform designed to empower farmers with localized actionable insights, weather patterns, disease detection via computer vision, market price t[...] 

This codebase is a monorepo consisting of a **React + Vite Frontend** and an **Enterprise Node.js + Express Backend**.

---

## 🏗️ Project Architecture

```
agriveda/
├── agriveda-main/          # Frontend Web Application (React, Vite, Tailwind CSS)
│   ├── src/                # UI Components and Contexts
│   ├── vite.config.ts      # Vite configuration & proxying
│   └── server.ts           # Optional Express SSR & Fallback Server
├── backend/                # Primary Backend API (Node.js, Express, TypeScript)
│   ├── src/                # Business logic, Controllers, Routes
│   ├── prisma/             # Database Schemas & Migrations (PostgreSQL)
│   ├── docker/             # Containerization instructions
│   └── docker-compose.yml  # Local cluster setup (DB, Redis, API)
└── README.md
```

---

## 🚀 Running Locally

### 1️⃣ Start the Backend Cluster (via Docker)
To get the backend, PostgreSQL database, and Redis cache running instantly:
1. Navigate to the backend directory:
   `cd backend`
2. Boot the infrastructure:
   `docker-compose up -d db redis`
3. Install dependencies natively:
   `npm install`
4. Push the database schema:
   `npx prisma db push`
5. Start the API locally:
   `npm run dev`

> **Note:** The backend API will be available at `http://localhost:5000`. Check out the **Swagger API Docs** at `http://localhost:5000/api/docs`.

### 2️⃣ Start the Frontend Dashboard
1. Open a new terminal and navigate to the frontend directory:
   `cd agriveda-main`
2. Install frontend dependencies:
   `npm install`
3. Start the Vite server:
   `npm run dev`
4. **Visit:** `http://localhost:3000`

---

## 🌍 Hosting & Deployment Guide

This application comprises two main parts. The optimal architecture uses **Vercel** for the React Frontend and **Railway (or Render)** for the Backend Services.

### 🌐 A. Deploying the Frontend (Vercel)
Vercel perfectly handles Vite/React applications automatically.
1. Create a free account on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Upon selecting this repository, set the **Root Directory** to `agriveda-main`.
4. Vercel will automatically detect Vite. 
5. In **Environment Variables**, you'll need to define any keys like `GEMINI_API_KEY` if used natively, or `VITE_API_URL` pointing to your hosted Backend API URL.
6. Click **Deploy**.

### ⚙️ B. Deploying the Backend (Railway / Render)
The backend requires Node.js, PostgreSQL, and Redis.

**Option 1: Railway (Easiest)**
1. Login to [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository and set the root directory to `/backend`.
4. Railway will automatically find the Dockerfile.
5. In your Railway project, click **New** -> **Database** -> Add **PostgreSQL** AND **Redis**.
6. Railway automatically exposes `DATABASE_URL` and `REDIS_URL`. Map these exactly to your Backend Service variables.
7. Set `NODE_ENV=production` and `PORT=5000`.

**Option 2: Render.com (Alternative)**
1. Create a new **Web Service** tied to your repository.
2. Select the `backend` directory.
3. Create a **PostgreSQL** instance alongside a **Redis** instance from the Render dashboard.
4. Input their private connection strings into your Web Service Environment Variables (`DATABASE_URL`, `REDIS_HOST`).
5. Set Build Command: `npm install && npx prisma generate && npx prisma db push && npx tsc`
6. Set Start Command: `node dist/server.js`

### 🔗 C. Connecting the Two

Once your backend is successfully deployed:
1. Navigate to your Frontend code.
2. Add a production proxy or replace your `/api/v1/...` `fetch()` domain pointers from `localhost` to your new Backend production URL (e.g. `https://agriveda-api.up.railway.app`).
3. If adjusting the backend CORS policy, whitelist your Vercel domain inside `backend/src/app.ts` under the `app.use(cors({ origin: 'YOUR_VERCEL_URL' }))` rule.

---

## 🔑 Environment Variables Reference

**Backend (`backend/.env`)**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/agriveda_db"
REDIS_HOST="localhost"
REDIS_PORT=6379
NODE_ENV="development"
PORT=5000
JWT_SECRET="super-secret-production-key"
GEMINI_API_KEY="AI_KEY_FROM_GOOGLE"
```
