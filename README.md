# NetShield — Internet & Wi-Fi Security Analyzer

An educational, defensive cybersecurity project by **Harshal Santoshi**, a 3rd Year Diploma Student in Information Technology / Cybersecurity at Government Polytechnic Murtizapur.

## Phase 1 and Phase 2

The foundation includes a responsive dark/light interface, landing page, mock local login/signup and guest mode, extensible dashboard navigation, About and ethical-use pages, reusable UI states, and a secured Express health endpoint.

Phase 2 adds browser-safe Wi-Fi context, Internet security checks, a permission-based public website header analyzer, transparent scoring, and a locally persisted security checklist. Results are evidence-based: browser-limited values are marked unavailable and are never fabricated.

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

For local website analysis, copy `frontend/.env.example` to `frontend/.env` if the backend is not running at the default `http://localhost:4000/api`. The website analyzer endpoint is `POST /api/website/analyze` with `{ "url": "https://example.com" }`. It validates URLs, blocks internal/private targets, uses manual redirects, timeouts, response-size limits, and rate limiting, and returns public response headers only.

## Structure

`frontend/src` holds components, layouts, pages, hooks, services, types, and utilities. `backend/src` holds routes, middleware, controllers, services, and utilities for future API phases.

## Authentication note

Phase 1 authentication is a development-only mock. It stores only the signed-in user’s display data in browser local storage; passwords are never stored, logged, or sent to the backend. A later phase should introduce server-side hashed credentials, secure sessions, and persistence.

## Roadmap

Phase 3 can add authenticated history, report export, and a separately hosted backend for the public deployment. GitHub Pages hosts the frontend only; the local Express API must be deployed separately and configured through `VITE_API_URL` before website analysis can work on the public site.

NetShield must remain defensive: it must not crack passwords, jam Wi-Fi, deauthenticate devices, steal credentials, or exploit systems without authorization.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. After pushing to the `main` branch, enable **Settings → Pages → GitHub Actions** if GitHub asks for a source. The public site will be available at `https://harshal142008.github.io/netShield/` after the workflow completes.
