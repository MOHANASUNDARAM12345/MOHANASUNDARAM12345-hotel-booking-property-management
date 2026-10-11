# StayRest Frontend

React 19 + Vite 8 single-page application for the StayRest Hotel Booking and
Property Management System. This is the customer-facing experience (search,
booking, payments, invoices, favorites) and the owner dashboard.

## Prerequisites

- Node.js 18+ (npm)
- The backend running on `http://localhost:8080` (see root `README.md`)

## Setup

```bash
npm install
```

Create a `.env.local` file in this directory (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Scripts

| Command            | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start the dev server with HMR                  |
| `npm run build`    | Produce a production build in `dist/`          |
| `npm run preview`  | Serve the production build locally             |
| `npm run lint`     | Run the Oxlint checks                          |

## Project Structure

```
src/
├── components/        # Shared UI (Navbar, Footer)
├── context/           # AuthContext (login state, token)
├── pages/             # Route views (Home, Hotels, HotelDetails,
│                      #   MyBookings, Payment, Invoice, OwnerDashboard, ...)
├── services/          # api.js — single REST client used by every page
└── main.jsx           # App entry point
```

## Conventions

- Every HTTP call goes through `src/services/api.js`, which attaches the JWT
  from `localStorage`, parses responses exactly once, and throws a normalized
  `Error` with a human-readable message on failure.
- Authentication state is shared through `AuthContext`; keep pages focused on
  rendering, not on token plumbing.
- Styling is plain CSS (design tokens in `index.css`); no CSS framework.

## Production API

By default `VITE_API_BASE_URL` points to the deployed backend
(`https://<app>.onrender.com/api`). Set a different value to target a local
backend during development.