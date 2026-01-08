# 📋 PROJECT RESPONSE SHEET
## API Integration & Authentication Flow (Frontend)

---

## 1. Project Overview

| Attribute | Details |
|-----------|---------|
| **Project Name** | API Integration & Authentication Flow (FE) |
| **Type** | Single Page Application (SPA) |
| **Live URL** | https://api-integration-authentication-flow.vercel.app/ |
| **Primary Purpose** | Demonstrate professional React authentication patterns with API integration |
| **Design System** | Neo-Brutalism UI |

### 1.1 Project Description
This is a **professional-grade React frontend application** that demonstrates real-world patterns for:
- User authentication flow (login, logout, session management)
- Protected routes and route guards
- Centralized API layer with Axios interceptors
- Token management with expiry handling
- Error handling with retry functionality

---

## 2. Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.3.1 | Build Tool & Dev Server |
| **React Router DOM** | 7.12.0 | Client-side Routing |
| **Axios** | 1.13.2 | HTTP Client with Interceptors |
| **ReqRes API** | - | Mock Backend for Authentication |
| **Vercel** | - | Deployment Platform |

---

## 3. Architecture & Folder Structure

```
src/
├── api/                    # Centralized API Layer
│   ├── client.js          # Axios instance with request/response interceptors
│   ├── auth.api.js        # Login/Register API functions
│   └── dashboard.api.js   # User data endpoints
│
├── auth/                   # Authentication System
│   ├── AuthContext.jsx    # React Context for global auth state
│   ├── auth.service.js    # Token validation & authentication logic
│   └── ProtectedRoute.jsx # Route guard component
│
├── components/             # Reusable UI Components
│   ├── Loader.jsx         # Loading spinner with message
│   ├── ErrorState.jsx     # Error display component
│   └── RetryButton.jsx    # Retry action button
│
├── pages/                  # Page Components
│   ├── Login.jsx          # Login form page
│   ├── Login.css          # Login page Neo-Brutalism styles
│   ├── Dashboard.jsx      # User dashboard page
│   └── Dashboard.css      # Dashboard Neo-Brutalism styles
│
├── routes/                 # Routing Configuration
│   └── AppRoutes.jsx      # Route definitions with protected routes
│
├── utils/                  # Utility Modules
│   ├── storage.js         # LocalStorage helper functions
│   └── constants.js       # App-wide constants
│
├── App.jsx                # Root component
├── App.css                # Global Neo-Brutalism design system
└── main.jsx               # Application entry point
```

---

## 4. Authentication Flow

### 4.1 Flow Diagram
```
┌─────────────────┐
│  User Opens App │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     No      ┌─────────────────┐
│  Token Exists?  │────────────▶│  Show Login     │
└────────┬────────┘             │  Page           │
         │ Yes                  └────────┬────────┘
         ▼                               │
┌─────────────────┐                      ▼
│  Token Valid?   │             ┌─────────────────┐
│  (< 30 mins)    │             │  User Enters    │
└────────┬────────┘             │  Credentials    │
         │                      └────────┬────────┘
    ┌────┴────┐                          │
    │         │                          ▼
   Yes        No               ┌─────────────────┐
    │         │                │  Submit Login   │
    ▼         ▼                │  (POST /login)  │
┌───────┐ ┌───────┐            └────────┬────────┘
│ Show  │ │ Clear │                     │
│ Dash  │ │ Token │              ┌──────┴──────┐
│ board │ │ ────▶│              │             │
└───────┘ │ Login │          Success       Failure
          └───────┘              │             │
                                 ▼             ▼
                          ┌───────────┐  ┌───────────┐
                          │ Store     │  │ Show      │
                          │ Token     │  │ Error     │
                          │ ────▶     │  │ & Retry   │
                          │ Dashboard │  └───────────┘
                          └───────────┘
```

### 4.2 Authentication States

| State | Description | Action |
|-------|-------------|--------|
| `loading` | Checking token validity on app load | Show loader |
| `authenticated` | Valid token exists (< 30 mins old) | Show Dashboard |
| `unauthenticated` | No token or expired | Redirect to Login |

### 4.3 Token Management

| Feature | Implementation |
|---------|----------------|
| **Storage Location** | `localStorage` (`auth_token`, `auth_token_timestamp`) |
| **Token Expiry** | 30 minutes (configurable via `TOKEN_EXPIRY_MINUTES`) |
| **Validation** | Automatic on app initialization |
| **401 Handling** | Global via Axios response interceptor |
| **Auto Cleanup** | Expired tokens are automatically removed |

---

## 5. API Integration Details

### 5.1 API Configuration

| Setting | Value |
|---------|-------|
| **Base URL** | `https://reqres.in/api` (via `VITE_API_BASE_URL`) |
| **Timeout** | 10,000ms |
| **Headers** | `Content-Type: application/json` |
| **Auth Header** | `Authorization: Bearer ${token}` (auto-injected) |

### 5.2 API Endpoints Used

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/login` | POST | User authentication | `{ token: "QpwL5tke4Pnpja7X4" }` |
| `/users` | GET | Fetch dashboard user data | `{ data: [...], total, page, ... }` |

### 5.3 Axios Interceptors

**Request Interceptor:**
```javascript
// Automatically injects Bearer token for authenticated requests
config.headers.Authorization = `Bearer ${token}`
```

**Response Interceptor:**
```javascript
// Global 401 error handling - clears token and redirects to login
if (error.response.status === 401) {
    removeToken()
    window.location.href = '/login'
}
```

### 5.4 Mock Fallback Mechanism
When ReqRes API is unavailable (e.g., Cloudflare blocking), the app **gracefully falls back** to mocked authentication:

| Credential | Mock Value |
|------------|------------|
| **Email** | `eve.holt@reqres.in` |
| **Password** | `cityslicka` |
| **Mock Token** | `QpwL5tke4Pnpja7X4_mock_${timestamp}` |

---

## 6. Key Components Response

### 6.1 AuthContext (Global State)

| Export | Type | Description |
|--------|------|-------------|
| `useAuth()` | Hook | Access auth context |
| `isAuthenticated` | boolean | Current auth status |
| `authLoading` | boolean | Loading state during auth operations |
| `authError` | string/null | Error message if auth failed |
| `login(email, password)` | function | Authenticate user |
| `logout()` | function | Clear auth and redirect |
| `clearError()` | function | Clear error state |
| `token` | string/null | Current auth token |

### 6.2 ProtectedRoute Component
Guards routes from unauthenticated access:
- ✅ If authenticated → Render child component
- ❌ If not authenticated → Redirect to `/login`
- ⏳ If loading → Show loading indicator

### 6.3 Error Handling Components

| Component | Props | Purpose |
|-----------|-------|---------|
| `ErrorState` | `title`, `message` | Display error information |
| `RetryButton` | `onClick`, `label` | Allow user to retry failed operations |
| `Loader` | `message` | Display loading state with message |

---

## 7. Neo-Brutalism Design System

### 7.1 Color Palette

| Variable | Color Code | Usage |
|----------|------------|-------|
| `--neo-cyan` | `#A6FAFF` | Primary buttons, stat cards |
| `--neo-yellow` | `#FEF08A` | Highlights, stat cards |
| `--neo-pink` | `#FFA6F6` | Focus states, stat cards |
| `--neo-lime` | `#BEF264` | Success, stat cards |
| `--neo-red` | `#FF6B6B` | Logout button, errors |
| `--neo-dark` | `#1a1a2e` | Text, borders |

### 7.2 Design Characteristics

| Element | Style |
|---------|-------|
| **Borders** | Bold 2px solid black |
| **Shadows** | Hard offset `4px 4px 0px #000` |
| **Buttons** | Press-down effect on click |
| **Cards** | White background with hard shadows |
| **Inputs** | Pink background on focus |
| **Typography** | Bold, high contrast |

---

## 8. Routes Configuration

| Path | Component | Access Level |
|------|-----------|--------------|
| `/login` | `Login` | Public |
| `/dashboard` | `Dashboard` | 🔒 Protected |
| `/` | Redirect to `/dashboard` | - |

---

## 9. Environment Configuration

### 9.1 Required Variables

```env
VITE_API_BASE_URL=https://reqres.in/api
```

### 9.2 App Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `TOKEN_EXPIRY_MINUTES` | `30` | Token validity duration |
| `ROUTES.LOGIN` | `/login` | Login page route |
| `ROUTES.DASHBOARD` | `/dashboard` | Dashboard page route |

---

## 10. Testing Scenarios

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | Enter wrong credentials | Error message with retry button |
| 2 | Enter correct credentials | Redirect to dashboard |
| 3 | Refresh on dashboard | Stay authenticated |
| 4 | Click logout | Clear token, redirect to login |
| 5 | Access `/dashboard` when logged out | Redirect to login |
| 6 | Wait 30+ minutes | Token expires, auto-logout |
| 7 | API unavailable | Fallback to mock authentication |

### Test Credentials

| Field | Value |
|-------|-------|
| **Email** | `eve.holt@reqres.in` |
| **Password** | `cityslicka` |

---

## 11. Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (http://localhost:5174) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 12. Deployment Information

| Platform | URL |
|----------|-----|
| **Vercel** | https://api-integration-authentication-flow.vercel.app/ |

**Deployment Configuration** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 13. Design Decisions & Rationale

### Why React Context API over Redux?
- ✅ Simpler for auth state (only 3 states: loading, authenticated, unauthenticated)
- ✅ Less boilerplate than Redux
- ✅ Built into React - no extra dependencies

### Why Separate API Layer?
- ✅ Single source of truth for API configuration
- ✅ Automatic token injection via interceptors
- ✅ Centralized error handling for 401 responses

### Why Neo-Brutalism UI?
- ✅ Eye-catching and memorable design
- ✅ High contrast for accessibility
- ✅ Modern trend in web design

### Why Mock Fallback?
- ✅ Ensures app remains functional even if ReqRes API is blocked
- ✅ Follows BRD requirement: "Mocked logic OR Public API"
- ✅ Provides consistent demo experience

---

## 14. Branch Structure

| Branch | Purpose |
|--------|---------|
| `feature/core-api-setup` | API layer, utilities, project structure |
| `feature/auth-system` | AuthContext, Login, protected routes |
| `feature/dashboard-routes` | Dashboard, routing, README |
| `main` | Production-ready merged code |

---

## 15. Summary

This project demonstrates a **production-ready React authentication system** with:

| Feature | Status |
|---------|--------|
| Complete Auth Flow | ✅ |
| Protected Routes | ✅ |
| Token Management | ✅ |
| API Integration | ✅ |
| Error Handling | ✅ |
| Mock Fallback | ✅ |
| Neo-Brutalism UI | ✅ |
| Responsive Design | ✅ |
| Live Deployment | ✅ |

---

**License:** MIT - Feel free to use this project as a reference!
