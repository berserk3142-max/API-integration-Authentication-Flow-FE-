# API Integration & Authentication Flow (Frontend)

A professional React authentication system demonstrating real-world patterns for state management, protected routes, and API integration.

## Architecture Overview

```
src/
├── api/           # Centralized API layer with Axios interceptors
├── auth/          # Authentication context, service, and route protection
├── components/    # Reusable UI components (Loader, ErrorState, RetryButton)
├── pages/         # Page components (Login, Dashboard)
├── routes/        # Application routing configuration
└── utils/         # Utilities (storage, constants)
```

## Authentication Flow

The app manages 3 distinct auth states:

| State | Description |
|-------|-------------|
| `loading` | Checking token validity on app load |
| `authenticated` | Valid token exists, user has access |
| `unauthenticated` | No token or expired, redirect to login |

### Login Flow

1. User submits credentials
2. Button disabled, loader shown
3. API call to ReqRes `/login`
4. **Success**: Store token with timestamp → Update auth state → Redirect to dashboard
5. **Failure**: Show user-friendly error → Enable retry

### Token Management

- Tokens stored in `localStorage` with timestamp
- 30-minute expiry (configurable in `constants.js`)
- Automatic validation on app load
- Global 401 handling via Axios interceptor

## Design Decisions

### Why Context API over Redux?

- **Simpler mental model** for auth state (3 states only)
- **Less boilerplate** than Redux action/reducer pattern
- **Built-in to React** — no additional dependencies
- **Sufficient for auth** — we don't need time-travel debugging or complex state

### Why Separate API Layer?

- **Single source of truth** for API configuration
- **Automatic token injection** via request interceptor
- **Centralized 401 handling** via response interceptor
- **Easier testing** — mock the API layer, not fetch calls

### Why Storage Utilities?

- **Avoids repeated localStorage calls** scattered in components
- **Easy to replace** with sessionStorage or cookies later
- **Encapsulates expiry logic** in one place

## Error Handling Strategy

| Layer | Handling |
|-------|----------|
| API Client | Intercepts 401 → clears token → redirects |
| Auth Context | Catches login errors → exposes to UI |
| Pages | Shows user-friendly messages with retry option |
| Console | Technical errors logged for debugging |

**User-facing errors are always friendly and actionable**, never technical stack traces.

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

### Test Credentials (ReqRes API)

- **Email**: `eve.holt@reqres.in`
- **Password**: any value

## Testing the Auth Flow

1. **Login with wrong credentials** → Should show error with retry
2. **Login with correct credentials** → Should redirect to dashboard
3. **Refresh on dashboard** → Should stay authenticated
4. **Click logout** → Should clear token and redirect
5. **Access `/dashboard` when logged out** → Should redirect to login
6. **Wait 30+ minutes** → Token expires, redirects to login

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `feature/core-api-setup` | API layer, utilities, project structure |
| `feature/auth-system` | AuthContext, Login, protected routes |
| `feature/dashboard-routes` | Dashboard, routing, README |
| `main` | Production-ready merged code |

## Tech Stack

- React 19 + Vite
- React Router v7
- Axios (with interceptors)
- ReqRes API (mock backend)
