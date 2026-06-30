# HealthWatch — Community Health Surveillance & Early Warning System

A full-stack web application that enables community health workers to report water-borne disease cases, analyzes disease trends with a rule-based prediction engine, and provides AI-powered alerts, recommendations, and awareness content to health authorities — built to help detect outbreaks before they spread.

**Live demo:** [https://heath-watch.vercel.app](https://heath-watch.vercel.app)
**Backend API:** [https://heathwatch.onrender.com](https://heathwatch.onrender.com)

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up — subsequent requests are fast.

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | _register your own_ | — |
| Health Officer | _register your own_ | — |
| Volunteer | _register your own_ | — |

Registration is open — create an account with any role to explore the corresponding dashboard.

---

## Overview

HealthWatch focuses on **early detection**, **centralized surveillance**, and **faster response** rather than medical diagnosis. Field volunteers report symptoms and case data from villages; the system aggregates this data, runs it through a rule-based risk-scoring engine, and automatically generates alerts with AI-assisted recommendations for health officers and administrators to act on.

## Features

- **Role-based access** — Volunteer, Health Officer, and Administrator roles with distinct dashboards and permissions, secured with JWT authentication
- **Health case reporting** — Field volunteers submit structured reports covering symptoms, affected population, age group, and water source
- **Rule-based prediction engine** — Automatically scores outbreak risk (low / medium / high / critical) based on symptom clustering, case volume, and water source safety, then generates an alert with recommended actions
- **Live dashboards** — Real-time statistics, most-affected villages, and active alerts for officers and admins, powered by MongoDB aggregation pipelines
- **AI assistant** — Conversational chat for field guidance, powered by an LLM (NVIDIA NIM, OpenAI-compatible API)
- **AI-generated awareness content** — One-click generation of public health awareness posts in multiple languages
- **Alert management** — Officers and admins can review, resolve, or dismiss active alerts
- **Village management** — Admins can register and manage village metadata, including geolocation

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas), Mongoose |
| Authentication | JWT, bcrypt |
| AI | NVIDIA NIM (OpenAI-compatible API) |
| Charts | Chart.js |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Architecture

```
Client (Browser)
  HTML • CSS • Vanilla JS
        │
        ▼
   REST API (Express)
        │
┌───────┼────────┬──────────┬─────────────┐
│       │        │          │             │
Auth  Reports  Villages   Alerts    AI Service
│       │        │          │             │
└───────┴────────┴──────────┴─────────────┘
                  │
         Prediction Engine
                  │
            MongoDB Atlas
```

## API Reference

```
/api/auth        POST /register, POST /login, GET /me
/api/villages    GET, POST, GET /:id, PUT /:id
/api/reports     GET, POST, GET /:id, DELETE /:id, GET /my-reports, GET /village/:id
/api/alerts      GET, PUT /:id
/api/dashboard   GET /, GET /analytics
/api/ai          POST /chat, POST /summary, POST /awareness
/api/awareness   GET, POST, DELETE /:id
```

All routes except `/auth/register`, `/auth/login`, and `GET /awareness` require a Bearer JWT token. Role-based authorization is enforced at the route level (e.g. only `admin` can create villages or delete reports).

## Prediction Engine

Risk score is calculated from the last 7 days of reports per village:

| Condition | Points |
|---|---:|
| 5+ diarrhea cases (cumulative) | +20 |
| 5+ vomiting cases (cumulative) | +20 |
| 3+ fever cases (cumulative) | +15 |
| 10+ total affected | +20 |
| Unsafe water source reported | +15 |
| Existing reports present | +10 |

```
Score < 30   → Low Risk
30–59        → Medium Risk
60–79        → High Risk
80+          → Critical
```

Crossing the medium-risk threshold (30+) automatically creates or updates an active alert for the village, with tailored recommendations based on severity.

## Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or Atlas connection string)
- An NVIDIA NIM API key (free tier available at [build.nvidia.com](https://build.nvidia.com))

### Setup

```bash
git clone https://github.com/abhiramaleti18/HeathWatch.git
cd HeathWatch
npm install
```

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/health-surveillance
JWT_SECRET=your_jwt_secret_here
NVIDIA_API_KEY=your_nvidia_api_key_here
```

Start the backend:

```bash
npm run dev
```

Serve the frontend (from the `client` folder):

```bash
cd client
npx http-server -p 8080
```

Visit `http://localhost:8080/html/index.html`.

> If running the frontend against the local backend, update `API_BASE_URL` in `client/js/api.js` to `http://localhost:5000/api`.

## Project Structure

```
health-app/
├── client/
│   ├── html/        Pages
│   ├── css/          Stylesheet
│   ├── js/            Client logic, API helper
│   └── assets/
├── server/
│   ├── controllers/   Route handlers
│   ├── middleware/    Auth & role guards
│   ├── models/         Mongoose schemas
│   ├── routes/          Express routers
│   ├── services/        Prediction engine, AI service
│   └── server.js
└── README.md
```

## Future Enhancements

- Replace rule-based scoring with a trained ML model
- SMS-based reporting for areas with limited internet access
- GIS heatmap visualization of outbreak risk
- Offline-first reporting with local sync
- Integration with government health data systems

---

Built as a full-stack portfolio project demonstrating role-based authentication, real-time data aggregation, rule-based predictive analytics, and applied LLM integration.