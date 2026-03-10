# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 frontend dashboard for the Lucky Gift Engine - a gamification platform that provides instant-win and multiplayer pool-based reward systems. The application serves three distinct user roles (ADMIN, B2B_CLIENT, USER) with separate dashboards and permissions.

**Important**: This repository contains ONLY the frontend. All API endpoints are handled by a separate backend service at `http://192.168.1.7:3001/api`.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Authentication & Authorization

The app uses a JWT-based authentication system with role-based access control:

- **Authentication Flow**: Login → JWT token stored in localStorage (`activeToken`) → Zustand store persists user state → RoleGuard protects routes
- **API Client**: `src/lib/apiClient.ts` uses Axios interceptors to automatically attach Bearer tokens to requests
- **Role Guard**: `src/components/layout/RoleGuard.tsx` wraps protected routes and fetches fresh user data on mount to sync payment status and credentials
- **Three Roles**:
  - `ADMIN`: Manages clients, payments, global rules, security
  - `B2B_CLIENT`: Manages API keys, reward pools, billing, transactions
  - `USER`: End-user gameplay (not fully implemented in current codebase)

### Route Structure

The app uses Next.js App Router with route groups:

- `src/app/(auth)/` - Unauthenticated routes (login, register)
- `src/app/(dashboard)/` - Protected routes with sidebar layout
  - `admin/*` - Admin-only routes
  - `b2b/*` - B2B client routes
  - `user/*` - End-user routes

The dashboard layout (`src/app/(dashboard)/layout.tsx`) wraps all protected routes with RoleGuard and provides the Sidebar + Header shell.

### State Management

Uses Zustand with localStorage persistence:

- `src/store/useAuthStore.ts` - User authentication state (user, token, role, paymentStatus)
- `src/store/useUIStore.ts` - UI state (sidebar open/closed, theme)
- `src/store/useToastStore.ts` - Toast notifications

**Critical**: The auth store syncs the JWT token to localStorage separately (`activeToken` key) so the API client interceptor can access it.

### API Integration

All API calls go through custom hooks in `src/hooks/api/`:

- `useAuth.ts` - Login, register, logout, getMe
- `useAdmin.ts` - Admin operations (getDashboardStats, createClient, getClientAnalytics)
- `useB2B.ts` - B2B client operations (getAnalytics, updateWebhook, getActivePool, initiatePayment)
- `useEngine.ts` - Gift engine operations (spin, pool status)

**Admin API Functions**:
- `getDashboardStats()` - GET /api/admin/stats - Global platform metrics
- `createClient()` - POST /api/admin/clients - Onboard new B2B clients
- `getClientAnalytics()` - GET /api/admin/pools/:clientId - Client-specific analytics

**B2B API Functions**:
- `getAnalytics()` - GET /api/client/analytics - Self-service analytics (currently not implemented on backend)
- `updateWebhook()` - PUT /api/client/profile/webhook - Update webhook URL
- `getActivePool()` - GET /api/client/pool/active/:giftId - Check active pool status
- `initiatePayment()` - POST /api/payments/recharge - Stripe payment for wallet recharge

**API Client Interceptors**:
- **Request**: Automatically attaches `Authorization: Bearer <token>` header from localStorage
- **Admin Routes**: Adds `X-Role-Context: ADMIN` header which triggers injection of `x-internal-token`
- **Response**: Handles 401 (session expired → logout), 403 (access denied), 402 (quota exhausted → redirect to billing)

### Type System

All backend response types are strictly typed in `src/types/`:

- `auth.types.ts` - User, Role, AuthResponse, LoginResponse, ClientCredentials
- `b2b.types.ts` - Client, WebhookPayload, payment responses
- `gift.types.ts` - ProbabilityTier, SpinResponse, pool types, LuckyTransaction
- `admin.types.ts` - Admin-specific responses (CreateClientResponse, PoolAnalyticsResponse, DashboardStatsResponse)
- `api.types.ts` - Generic ApiResponse<T> wrapper

**Important**: These types mirror the backend Prisma models exactly. Do not modify them without coordinating with backend changes.

**Recent Type Changes** (as of latest git pull):
- Removed subscription management types (CreatePlanResponse, SubscribeClientResponse)
- Removed pool reset types (PoolResetResponse)
- Removed gift configuration types (GiftConfig, CreateConfigResponse, etc.)
- Added `DashboardStatsResponse` for admin global metrics
- Updated `PoolAnalyticsResponse` with new financial fields: `totalClientProfit`, `totalPlatformCut`, `totalReserveAdded`

### Styling

- Tailwind CSS v4 with dark mode support (`darkMode: "class"`)
- Dark theme is default and persists via localStorage (`theme` key)
- Custom animations defined in `tailwind.config.ts` (shimmer, bounceIn, slideUpFade)
- Color scheme: Purple/blue gradient for dark mode, standard grays for light mode

## Key Conventions

### Role-Based Routing

After login, users are redirected based on role:
- `ADMIN` → `/admin/dashboard`
- `B2B_CLIENT` → `/b2b/dashboard` (or `/b2b/api-keys` if no API key set up yet)
- `USER` → `/user/play`

The Sidebar component (`src/components/layout/Sidebar.tsx`) dynamically renders navigation links based on the current user's role.

### API Key Management

B2B clients have separate test and live API keys:
- Keys are stored encrypted in the backend
- `clientCredentials` object on User type contains `hasTestApiKey`, `hasLiveApiKey`, and optionally decrypted keys
- First-time B2B users are redirected to `/b2b/api-keys` to generate keys before accessing other features

### Environment Variables

Required environment variables (set via `.env.local`, not committed):
- `NEXT_PUBLIC_API_URL` - Backend API base URL (defaults to `http://192.168.1.7:3001/api`)
- `NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN` or `NEXT_PUBLIC_ADMIN_SECRET` - Admin internal token for privileged operations

### Component Organization

- `src/components/layout/` - Shell components (Sidebar, Header, Footer, RoleGuard, ThemeProvider)
- `src/components/features/` - Feature-specific components organized by domain (admin, b2b, engine, landing)
- `src/components/ui/` - Reusable UI primitives (ToastContainer, buttons, inputs)
- `src/components/media/` - Media assets and icons

## Important Notes

- This is a client-side rendered app with no API routes in Next.js
- All data fetching happens client-side via the custom hooks
- The RoleGuard component calls `getMe()` on mount to refresh user state from the backend, ensuring payment status and credentials are always fresh
- Never bypass the API client interceptors - they handle critical auth and error flows
- The backend uses Prisma ORM - type definitions here should match Prisma schema exactly

## Common Issues & Troubleshooting

### Admin Dashboard: "Access denied. ADMIN role required"

**Cause**: The `NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN` environment variable is not set.

**Solution**:
1. Check your backend `.env` file for `INTERNAL_SERVICE_TOKEN`
2. Create `.env.local` in the frontend root:
   ```bash
   NEXT_PUBLIC_API_URL=http://192.168.1.7:3001/api
   NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN=<copy-from-backend>
   ```
3. Restart the dev server: `npm run dev`

**How it works**: Admin routes require `x-internal-token` header. The API client interceptor automatically injects this header when it sees `X-Role-Context: ADMIN` in the request headers.

### B2B Dashboard: "Not found" when fetching analytics

**Cause**: The `/api/client/analytics` endpoint is not implemented on the backend yet.

**Current Status**: Analytics fetch is disabled in `src/app/(dashboard)/b2b/dashboard/page.tsx` (lines 31-45). The dashboard shows fallback values ("0", "-") until the backend implements this endpoint.

### Missing Pages

If you encounter 404 errors for admin routes, check that these pages exist:
- `/admin/clients` - B2B client onboarding (recently restored)
- `/admin/dashboard` - Admin overview
- `/admin/users` - User management
- `/admin/payments` - Payment controls
- `/admin/global-rules` - Global configuration
- `/admin/security` - Security & logs
