# NetShield — Internet & Wi-Fi Security Analyzer

An educational, defensive cybersecurity project by **Harshal Santoshi**, a 3rd Year Diploma Student in Information Technology / Cybersecurity at Government Polytechnic Murtizapur.

## Phase 1

This foundation includes a responsive dark/light interface, landing page, mock local login/signup and guest mode, extensible dashboard navigation, About and ethical-use pages, reusable UI states, and a secured Express health endpoint. No network scans, security tests, or real analysis results are produced in this phase.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide icons
- Backend: Node.js, Express, TypeScript, Helmet, CORS

## Run locally

Install dependencies in each project, then start both services in separate terminals:

```bash
cd frontend && npm install && npm run dev
cd backend && npm install && npm run dev
```

Or install from the repository root and use `npm run dev` (requires the root `concurrently` dependency).

The frontend is served by Vite (normally `http://localhost:5173`). The backend health endpoint is `http://localhost:4000/api/health`.

Copy `.env.example` to `.env` if backend environment overrides are needed. Never commit `.env` files.

## Structure

`frontend/src` holds components, layouts, pages, hooks, services, types, and utilities. `backend/src` holds routes, middleware, controllers, services, and utilities for future API phases.

## Authentication note

Phase 1 authentication is a development-only mock. It stores only the signed-in user’s display data in browser local storage; passwords are never stored, logged, or sent to the backend. A later phase should introduce server-side hashed credentials, secure sessions, and persistence.

## Roadmap

Phase 2 can add permission-based, transparent Wi-Fi/internet/website checks; authenticated history; and an explainable security score. NetShield must remain defensive: it must not crack passwords, jam Wi-Fi, deauthenticate devices, steal credentials, or exploit systems without authorization.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. After pushing to the `main` branch, enable **Settings → Pages → GitHub Actions** if GitHub asks for a source. The public site will be available at `https://harshal142008.github.io/netShield/` after the workflow completes.
